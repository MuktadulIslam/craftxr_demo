import { NextRequest, NextResponse } from 'next/server';
import { meshyAPIConfig } from '../../../../components/simulations/CreateNewSimulation/objects_layout/canvas/meshy/config/apiConfig';
import meshyAxiosInstance from '../../../../components/simulations/CreateNewSimulation/objects_layout/canvas/meshy/config/axios-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const payload = {
            prompt: body.prompt,
            art_style: body.art_style || 'realistic',
            symmetry: body.symmetry || 'auto',
            seed: body.seed || Math.floor(Math.random() * 1000000),
            ai_model: body.model_version || meshyAPIConfig.aimodel,
            mode: 'preview',
            should_remesh: true,
            topology: meshyAPIConfig.topology
        };

        const response = await meshyAxiosInstance.post(meshyAPIConfig.endpoints.textTo3D, payload);
        
        let attempts = 0;
        const maxAttempts = 120;
        const pollInterval = 5000;
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            attempts++;
            
            const object = await meshyAxiosInstance.get(meshyAPIConfig.endpoints.textGenerated3D(response.data.result));
            if (object.data.status === 'SUCCEEDED') {
                return NextResponse.json(object.data);
            }
        }

        return NextResponse.json(
            { error: 'Failed to generate 3D model from text' },
            { status: 500 }
        );

    } catch (error) {
        console.error('Text-to-3D API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate 3D model from text' },
            { status: 500 }
        );
    }
}