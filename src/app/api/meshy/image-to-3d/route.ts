import { NextRequest, NextResponse } from 'next/server';
import { meshyAPIConfig } from '../../../../components/simulations/CreateNewSimulation/objects_layout/canvas/meshy/config/apiConfig';
import meshyAxiosInstance from '../../../../components/simulations/CreateNewSimulation/objects_layout/canvas/meshy/config/axios-config';
// import meshyAxiosInstance from '../../../../components/canvas/meshy/config/axios-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.image_data) {
            return NextResponse.json(
                { error: 'image_data is required' },
                { status: 400 }
            );
        }

        const payload = {
            image_url: body.image_data[0], // Taking only the first image & this should be a base64 data URI or URL
            ai_model: body.model_version || meshyAPIConfig.aimodel,
            texture_prompt: body.texture_prompt || '',
            symmetry_mode: body.symmetry || 'auto',
            should_remesh: true,
            should_texture: true,
            enable_pbr: true,
        };

        const response = await meshyAxiosInstance.post(meshyAPIConfig.endpoints.imageTo3D, payload);
        const taskId = response.data.result;

        let attempts = 0;
        const maxAttempts = 120;
        const pollInterval = 5000;

        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            attempts++;

            const statusResponse = await meshyAxiosInstance.get(meshyAPIConfig.endpoints.imageGenerated3D(taskId));
            if (statusResponse.data.status === 'SUCCEEDED') {
                return NextResponse.json(statusResponse.data);
            }
        }

        return NextResponse.json(
            { error: 'Image-to-3D generation failed' },
            { status: 500 }
        );

    } catch (error) {
        console.error('Image-to-3D API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate 3D model from the image' },
            { status: 500 }
        );
    }
}