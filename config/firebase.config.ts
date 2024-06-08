import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export const initializeFirebase = (configService: ConfigService) => {
  const privateKey = configService
    .get<string>('firebase.private_key')
    .replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: configService.get<string>('firebase.project_id'),
      clientEmail: configService.get<string>('firebase.client_email'),
      privateKey: privateKey,
    }),
  });

  console.log('Firebase Admin Initialized');
};

export const firebaseAdmin = admin;
