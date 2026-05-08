"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface PointsContextType {
    points: number;
    refreshPoints: () => Promise<void>;
}

const PointsContext = createContext<PointsContextType>({
    points: 0,
    refreshPoints: async () => {},
});

export function PointsProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [points, setPoints] = useState(0);
    const lastTxnId = useRef<string | null>(null);
    const isFirstLoad = useRef(true);

    const refreshPoints = useCallback(async () => {
        if (!session?.user) return;
        
        try {
            const res = await axios.get("/api/points/latest");
            if (res.data) {
                setPoints(res.data.points);
                
                const latestTxn = res.data.latestTxn;
                if (latestTxn) {
                    if (isFirstLoad.current) {
                        lastTxnId.current = latestTxn.id;
                        isFirstLoad.current = false;
                        return;
                    }

                    if (latestTxn.id !== lastTxnId.current) {
                        lastTxnId.current = latestTxn.id;
                        const sign = latestTxn.points >= 0 ? "+" : "";
                        const amountStr = `${sign}${latestTxn.points}`;
                        
                        if (latestTxn.points >= 0) {
                            toast.success(`Points Activity: ${amountStr} (${latestTxn.type})`);
                        } else {
                            toast.error(`Points Activity: ${amountStr} (${latestTxn.type})`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch points", error);
        }
    }, [session?.user]);

    // Initial load
    useEffect(() => {
        refreshPoints();
    }, [refreshPoints]);

    return (
        <PointsContext.Provider value={{ points, refreshPoints }}>
            {children}
        </PointsContext.Provider>
    );
}

export function usePoints() {
    return useContext(PointsContext);
}
