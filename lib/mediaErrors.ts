type MediaDeviceKind = 'camera' | 'microphone';

export function getMediaErrorMessage(
  kind: MediaDeviceKind,
  err: unknown
): string {
  const label = kind === 'camera' ? 'Camera' : 'Microphone';

  if (!(err instanceof DOMException)) {
    return `An unexpected ${kind} error occurred.`;
  }

  switch (err.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return `${label} access was denied. Enable it in your browser settings and refresh.`;
    case 'NotFoundError':
      return kind === 'camera'
        ? 'No camera detected. Connect a webcam and refresh.'
        : 'No microphone detected. Connect a mic and refresh.';
    case 'NotReadableError':
      return `${label} is in use by another application. Close it and refresh.`;
    default:
      return `${label} error: ${err.message}`;
  }
}
