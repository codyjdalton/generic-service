
export interface Thread {
    id: string;
    knotId: string;
    narrativeId: string;
    key: string;
    title: string;
    headline: string;
    mood: number; // 0 - 100
    interest: number; // 0 - 100
    severity: number;
    showImage: boolean;
}