import type { OutputData } from "@editorjs/editorjs";

export interface OnboardingProgram {
    id: string;
    name: string;
    content: string | OutputData;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
}