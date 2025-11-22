import { NextRequest, NextResponse } from 'next/server';
import muhammara from 'muhammara';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const password = formData.get('password') as string;

        if (!file || !password) {
            return NextResponse.json(
                { error: 'File and password are required' },
                { status: 400 }
            );
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF files are allowed.' },
                { status: 400 }
            );
        }

        // Read file buffer
        const arrayBuffer = await file.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuffer);

        // Use temporary files for encryption (muhammara recrypt requires files)
        const tempId = crypto.randomUUID();
        const tempInputPath = path.join(os.tmpdir(), `input_${tempId}.pdf`);
        const tempOutputPath = path.join(os.tmpdir(), `output_${tempId}.pdf`);

        try {
            // Write input to temp file
            await fs.promises.writeFile(tempInputPath, inputBuffer);

            // Encrypt using muhammara.recrypt
            muhammara.recrypt(tempInputPath, tempOutputPath, {
                userPassword: password,
                ownerPassword: password,
                userProtectionFlag: 4
            });

            // Read encrypted output
            const outputBuffer = await fs.promises.readFile(tempOutputPath);

            // Return the file as a stream
            return new NextResponse(outputBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="protected_${file.name}"`,
                },
            });
        } finally {
            // Cleanup temp files
            try {
                if (fs.existsSync(tempInputPath)) await fs.promises.unlink(tempInputPath);
                if (fs.existsSync(tempOutputPath)) await fs.promises.unlink(tempOutputPath);
            } catch (cleanupError) {
                console.error('Error cleaning up temp files:', cleanupError);
            }
        }
    } catch (error) {
        console.error('Error processing PDF:', error);
        return NextResponse.json(
            { error: 'Failed to process PDF' },
            { status: 500 }
        );
    }
}
