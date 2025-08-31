import { SelectableObjectRef } from '../canvas/types';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

export const uploadGlbToAzure = async (meshRef: SelectableObjectRef, fileName?: string) => {
    try {
        const exporter = new GLTFExporter();
        
        const exportPromise = new Promise<ArrayBuffer | object>((resolve, reject) => {
            if (meshRef.current) {
                exporter.parse(
                    meshRef.current,
                    (result) => resolve(result),
                    (error) => reject(error),
                    {
                        binary: true, // This ensures we get ArrayBuffer
                        includeCustomExtensions: false,
                        truncateDrawRange: true
                    }
                );
            } else {
                reject(new Error('meshRef.current is null'));
            }
        });

        const result = await exportPromise;

        // Ensure we have an ArrayBuffer
        if (!(result instanceof ArrayBuffer)) {
            throw new Error('Expected ArrayBuffer but got JSON result');
        }

        // Use provided filename or generate one
        const finalFileName = fileName ? 
            (fileName.endsWith('.glb') ? fileName : `${fileName}.glb`) : 
            `object-${Date.now().toString()}.glb`;

        // Send ArrayBuffer directly with metadata in headers
        const response = await fetch('/api/azure/upload/model', {
            method: 'POST',
            headers: {
                'Content-Type': 'model/gltf-binary',
                'filename': finalFileName,
                'file_size': result.byteLength.toString(),
            },
            body: result, // Send ArrayBuffer directly
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

// Interface for upload items
interface UploadItem {
    ref: SelectableObjectRef;
    fileName: string;
}

// New function to upload multiple files asynchronously
export const uploadMultipleGlbToAzure = async (uploadItems: UploadItem[]): Promise<boolean> => {
    try {
        // Create an array of upload promises
        const uploadPromises = uploadItems.map(async (item, index) => {
            try {
                await uploadGlbToAzure(item.ref, item.fileName);
                return true;
            } catch (error) {
                console.error(`Failed to upload file "${item.fileName}" (${index + 1}/${uploadItems.length}):`, error);
                return false;
            }
        });

        // Wait for all uploads to complete
        const results = await Promise.allSettled(uploadPromises);

        // Check if all uploads were successful
        const allSuccessful = results.every(result => 
            result.status === 'fulfilled' && result.value === true
        );
        return allSuccessful;
    } catch (error) {
        console.error('Batch upload process failed:', error);
        return false;
    }
}