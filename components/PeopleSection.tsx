"use client";
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconUserQuestion, IconTrash, IconEdit, IconLoader } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Person {
    id: string;
    name: string;
    relation: string | null;
    notes: string | null;
}

export function PeopleSection() {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editPerson, setEditPerson] = useState<Person | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States
    const [activeTab, setActiveTab] = useState("single");
    const [singleForm, setSingleForm] = useState({ name: "", relation: "", notes: "" });
    const [bulkText, setBulkText] = useState("");

    const fetchPeople = useCallback(async () => {
        try {
            const res = await axios.get("/api/people");
            setPeople(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch people");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPeople();
    }, [fetchPeople]);

    const handleCreateSingle = async () => {
        if (!singleForm.name) return toast.error("Name is required");
        setIsSubmitting(true);
        try {
            await axios.post("/api/people", singleForm);
            toast.success("Person added");
            setSingleForm({ name: "", relation: "", notes: "" });
            setIsCreateOpen(false);
            fetchPeople();
        } catch {
            toast.error("Failed to add person");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateBulk = async () => {
        if (!bulkText) return toast.error("Bulk text is required");
        setIsSubmitting(true);
        try {
            await axios.post("/api/people", { bulkText });
            toast.success("People added successfully");
            setBulkText("");
            setIsCreateOpen(false);
            fetchPeople();
        } catch {
            toast.error("Failed to bulk add people");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editPerson) return;
        setIsSubmitting(true);
        try {
            await axios.put(`/api/people/${editPerson.id}`, {
                name: editPerson.name,
                relation: editPerson.relation,
                notes: editPerson.notes
            });
            toast.success("Person updated");
            setEditPerson(null);
            fetchPeople();
        } catch {
            toast.error("Failed to update person");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!editPerson) return;
        if (!confirm("Are you sure you want to delete this person?")) return;
        try {
            await axios.delete(`/api/people/${editPerson.id}`);
            toast.success("Person deleted");
            setEditPerson(null);
            fetchPeople();
        } catch {
            toast.error("Failed to delete person");
        }
    };

 
    const getInitials = (name: string) => {
        return name[0].toUpperCase();
        // return name
        //     .split(" ")
        //     .map((n) => n[0])
        //     .join("")
        //     .substring(0, 2)
        //     .toUpperCase();
    };

    // Helper to get color based on index or name (for consistent styling)
    const getColorClass = (idx: number) => {
        const colors = ["bg-red-500/10 hover:bg-red-500/30 text-red-500 hover:text-red-300", "bg-blue-500/10 hover:bg-blue-500/30 text-blue-500 hover:text-blue-300", "bg-green-500/10 hover:bg-green-500/30 text-green-500 hover:text-green-300", "bg-yellow-500/10 hover:bg-yellow-500/30 text-yellow-500 hover:text-yellow-300", "bg-purple-500/10 hover:bg-purple-500/30 text-purple-500 hover:text-purple-300", "bg-pink-500/10 hover:bg-pink-500/30 text-pink-500 hover:text-pink-300", "bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-500 hover:text-indigo-300", "bg-orange-500/10 hover:bg-orange-500/30 text-orange-500 hover:text-orange-300"];
        return colors[idx % colors.length];
    }

    return (
        <Card className="h-full">
            <CardHeader  >
                <CardTitle className="flex justify-between items-center font-medium text-muted-foreground  ">
                    <div className="flex items-center gap-1">
                        People vs You
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-[10px]">{people.length}</span>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger render={<Button variant="outline"   className=" ">
                                <IconPlus size={12} /> Add
                            </Button>}>
                            
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add People</DialogTitle>
                                <DialogDescription>Manage your connections.</DialogDescription>
                            </DialogHeader>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="single">Single</TabsTrigger>
                                    <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
                                </TabsList>
                                <TabsContent value="single" className="space-y-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Name</Label>
                                        <Input placeholder="John Doe" value={singleForm.name} onChange={e => setSingleForm({ ...singleForm, name: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Relation (Optional)</Label>
                                        <Input placeholder="Friend, Colleague..." value={singleForm.relation} onChange={e => setSingleForm({ ...singleForm, relation: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Notes (Optional)</Label>
                                        <Input placeholder="Any details..." value={singleForm.notes} onChange={e => setSingleForm({ ...singleForm, notes: e.target.value })} />
                                    </div>
                                    <Button onClick={handleCreateSingle} disabled={isSubmitting} className="w-full">Add Person</Button>
                                </TabsContent>
                                <TabsContent value="bulk" className="space-y-4 py-4">
                                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                                        <p className="font-medium mb-1">Format (one per line):</p>
                                        Name, Relation, Notes<br />
                                        Ex:<br />
                                        Alice, Friend, Met at coffee shop<br />
                                        Bob, Coworker
                                    </div>
                                    <Textarea
                                        placeholder="Paste your list here..."
                                        className="h-[150px]"
                                        value={bulkText}
                                        onChange={e => setBulkText(e.target.value)}
                                    />
                                    <Button onClick={handleCreateBulk} disabled={isSubmitting} className="w-full">Bulk Add</Button>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[150px]   ">
                <CardContent className="flex flex-wrap gap-1 pt-0">
                    {loading ? (
                        <div className="w-full flex justify-center py-4"><IconLoader className="animate-spin text-muted-foreground" size={20} /></div>
                    ) : people.length === 0 ? (
                        <div className="text-xs text-muted-foreground w-full text-center py-4">No people added yet.</div>
                    ) : (
                        people.map((person, idx) => (
                            <TooltipProvider  key={person.id}>
                                <Tooltip>
                                    <TooltipTrigger><div
                                        key={person.id}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer transition-all ${getColorClass(idx)}`}
                                        onClick={() => setEditPerson(person)}
                                        title={person.name}
                                    >
                                        {getInitials(person.name)}
                                    </div></TooltipTrigger>
                                    <TooltipContent  >
                                        <section className=" body-font overflow-hidden">
                                            <div className="  flex flex-col items-start ">
                                                <h2 className="   title-font font-medium   ">{person.name}</h2>
                                                <p className="    leading-relaxed  ">{person.notes}</p>


                                            </div>

                                        </section>

                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))
                    )}
                </CardContent>
            </ScrollArea>

            {/* Edit/Details Dialog */}
            <Dialog open={!!editPerson} onOpenChange={(open) => !open && setEditPerson(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Person</DialogTitle>
                    </DialogHeader>
                    {editPerson && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input value={editPerson.name} onChange={e => setEditPerson({ ...editPerson, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Relation</Label>
                                <Input value={editPerson.relation || ""} onChange={e => setEditPerson({ ...editPerson, relation: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Notes</Label>
                                <Textarea value={editPerson.notes || ""} onChange={e => setEditPerson({ ...editPerson, notes: e.target.value })} />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:justify-between">
                        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isSubmitting}><IconTrash size={16} className="mr-1" /> Delete</Button>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => setEditPerson(null)}>Cancel</Button>
                            <Button onClick={handleUpdate} disabled={isSubmitting}>Save Changes</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
