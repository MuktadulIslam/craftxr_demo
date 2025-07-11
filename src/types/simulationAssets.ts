interface Animation {
    animation_name: string;
    animation_type: string;
    animation_description: string;
    animation_variation: string;
    speed_factor: number;
    loop: boolean;
    animation_category: string;
  }
  
  interface TextureOverride {
    texture_name: string;
    texture_description: string;
    texture_url: string;
  }
  
  interface AssetConfig {
    asset: string;
    position_x: number;
    position_y: number;
    span_x: number;
    span_y: number;
    rotation: [number, number, number];
    animation: Animation | null;
    texture_override: TextureOverride | null;
  }
  
  export interface AssetConfigurationData {
    asset_config: AssetConfig[];
  }