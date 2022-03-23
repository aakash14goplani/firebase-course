import * as functions from "firebase-functions";
import { createUserApp } from "./create-user";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const onAddCourseUpdatePromoCounter =
  functions.runWith({
    memory: "128MB",
    timeoutSeconds: 300
  }).firestore.document("courses/{courseId}").onCreate(async (snap, context) => {
    await (await import('./on-add-course')).default(snap, context);
  });

export const onCourseUpdatedUpdatePromoCounter =
  functions.runWith({
    memory: "128MB",
    timeoutSeconds: 300
  }).firestore.document("courses/{courseId}").onUpdate(async (change, context) => {
    await (await import('./on-update-course')).default(change, context);
  });

export const onCourseDeletedUpdatePromoCounter =
  functions.runWith({
    memory: "128MB",
    timeoutSeconds: 300
  }).firestore.document("courses/{courseId}").onDelete(async (snap, context) => {
    await (await import('./on-delete-course')).default(snap, context);
  });

export const createUser = functions.https.onRequest(createUserApp);
