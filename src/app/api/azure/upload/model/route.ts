import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

class AzureBlobManager {
  private static instance: AzureBlobManager;
  private blobServiceClient: BlobServiceClient | null = null;
  private containerClient: ContainerClient | null = null;
  private readonly containerName: string;

  private constructor() {
    this.containerName = process.env.NEXT_PUBLIC_AZURE_CONTAINER_NAME || 'room_models';
  }

  public static getInstance(): AzureBlobManager {
    if (!AzureBlobManager.instance) {
      AzureBlobManager.instance = new AzureBlobManager();
    }
    return AzureBlobManager.instance;
  }

  public getContainerClient(): ContainerClient {
    if (!this.containerClient) {
      const AZURE_SAS_URL = "https://craftxraddressableasset.blob.core.windows.net/users-models?sp=rc&st=2025-08-22T12:34:47Z&se=2035-08-22T20:49:47Z&sv=2024-11-04&sr=c&sig=X%2B1C3tdqcalLN9Cc0qcUn7AThf58bctbCjuJljCn5M8%3D";

      if (!AZURE_SAS_URL) {
        throw new Error('Azure SAS URL not configured');
      }

      this.blobServiceClient = new BlobServiceClient(AZURE_SAS_URL);
      this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    }

    return this.containerClient;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the ArrayBuffer from the request body
    const arrayBuffer = await request.arrayBuffer();

    // Get metadata from headers
    const fileName = request.headers.get('filename');
    const contentType = request.headers.get('Content-Type') || 'model/gltf-binary';

    if (!fileName) {
      return NextResponse.json({ error: 'No filename provided in headers' }, { status: 400 });
    }

    if (!arrayBuffer.byteLength) {
      return NextResponse.json({ error: 'No file data provided' }, { status: 400 });
    }

    // Validate file extension
    if (!fileName.toLowerCase().endsWith('.glb')) {
      return NextResponse.json({ error: 'Only .glb files are allowed' }, { status: 400 });
    }

    // Validate file size (50MB max)
    const fileSize = arrayBuffer.byteLength;
    if (fileSize > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 50MB' }, { status: 400 });
    }

    // Get container client
    const containerClient = AzureBlobManager.getInstance().getContainerClient();
    const blobClient = containerClient.getBlockBlobClient(fileName);

    // Convert ArrayBuffer to Buffer (Node.js Buffer)
    const buffer = Buffer.from(arrayBuffer);

    // Upload options
    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: contentType,
      },
    };

    await blobClient.upload(buffer, buffer.length, uploadOptions);
    return NextResponse.json({
      success: true,
      url: blobClient.url,
      fileName: fileName,
      size: fileSize
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}