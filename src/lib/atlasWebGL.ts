export type AtlasWebGLStatus = 'available' | 'unavailable';
export type AtlasWebGLContextType = 'webgl2' | 'webgl' | null;

export interface AtlasWebGLProbe {
  status: AtlasWebGLStatus;
  supported: boolean;
  contextType: AtlasWebGLContextType;
  reason: string | null;
}

export const webGLUnavailableReason = 'WebGL unavailable or blocked by this browser profile.';
export const webGLProbeErrorReason = 'WebGL availability check threw before the Atlas canvas could mount.';

export const atlasWebGLContextAttributes: WebGLContextAttributes = {
  failIfMajorPerformanceCaveat: true,
  powerPreference: 'default',
};

export function probeAtlasWebGL(documentRef: Document | undefined = typeof document === 'undefined' ? undefined : document): AtlasWebGLProbe {
  if (!documentRef) {
    return {
      status: 'unavailable',
      supported: false,
      contextType: null,
      reason: 'Document unavailable during WebGL probe.',
    };
  }

  try {
    const canvas = documentRef.createElement('canvas');
    const webGL2Context = canvas.getContext('webgl2', atlasWebGLContextAttributes);

    if (webGL2Context) {
      return {
        status: 'available',
        supported: true,
        contextType: 'webgl2',
        reason: null,
      };
    }

    const webGLContext = canvas.getContext('webgl', atlasWebGLContextAttributes);

    if (webGLContext) {
      return {
        status: 'available',
        supported: true,
        contextType: 'webgl',
        reason: null,
      };
    }

    return {
      status: 'unavailable',
      supported: false,
      contextType: null,
      reason: webGLUnavailableReason,
    };
  } catch (error) {
    console.warn(`[Atlas] ${webGLProbeErrorReason}`, error);
    return {
      status: 'unavailable',
      supported: false,
      contextType: null,
      reason: webGLProbeErrorReason,
    };
  }
}
