// Scene TypeScript Interface

interface SceneLayout {
    floor_rows: number;
    floor_columns: number;
    rotation: [number, number, number];
}

interface Asset {
    asset_id: string;
    asset_name: string;
    asset_type: 'A' | 'P';
    asset_model: string | null;
}

interface SceneAsset {
    asset: Asset;
}

interface Scene {
    scene_layout: SceneLayout;
    scene_assets: SceneAsset[];
    scene_description: string;
    ambient_sounds: Record<string, object | string | number>; // This could be refined based on actual data
    scene_location: string;
    scene_ambiance: string;
}

export interface SimulationSceneConfig {
    scene: Scene;
}