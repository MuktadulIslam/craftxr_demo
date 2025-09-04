type ObjectId = string;
type GenerationType = 'text-to-3d' | 'image-to-3d';
type ArtStyles = 'realistic' | 'sculpture';
type Symmetry = 'auto' | 'on' | 'off';
type MeshyModelVersion = 'meshy-4' | 'meshy-5';

// =====================================
// USER SCHEMA
// =====================================
interface UserSchema {
    _id: ObjectId;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    archivedAt: Date | null;
    preferences: {
        defaultModel: MeshyModelVersion;
        defaultArtStyle: ArtStyles;
        defaultSymmetry: Symmetry;
        defaultGenerationType: GenerationType;
    };
    usage: {
        totalModelsGenerated: number;
        totalUsesOfTokens: number;
        lastActiveAt: Date;
    };
}

// =====================================
// CHAT SESSION SCHEMA
// =====================================
interface ChatSessionSchema {
    _id: ObjectId;
    userId: ObjectId; // Reference to User in UserSchema
    sessionName: string;
    totalUsesOfTokens: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    chatMessages: ChatMessageSchema[];
}

// =====================================
// CHAT MESSAGE SCHEMA
// =====================================
interface ChatMessageSchema {
    _id: ObjectId;
    sessionId: ObjectId; // Reference to ChatSession
    userId: ObjectId; // Reference to User (denormalized for faster queries)
    type: 'user' | 'assistant';
    content: string;
    editedAt: Date;
    images_urls: string[];
    
    generationSettings: {
        generationType: GenerationType;
        model: MeshyModelVersion;
        artStyle: ArtStyles;
        symmetry: Symmetry;
        seed?: number;
    };
    modelData?: {
        model_id: string;
        images_urls: string[];
        modelUrls?: {
            glb?: string;
            fbx?: string;
            usdz?: string;
            obj?: string;
            mtl?: string;
        };
    };
}