
"use client";
import React, { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChartBarInteractive } from "@/components/chart-bar-interactive";

export default function UrgesPage() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <ChartBarInteractive title="Urges Overview" />
            <Pagination>
                <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                    <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
