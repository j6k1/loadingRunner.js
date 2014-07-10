declare var LoadingRunner: LoadingRunnerStatic;

interface LoadingRunnerStatic {
    new (initializer: () => (degree: number) => void, rotation_time?: number);
    new (initializer: () => void, rotation_time?: number);
    canvasLoaderCreator(canvasId: string, color?: { r: number; g: number; b: number }): () => (degree: number) => void;
}
interface LoadingRunner {
    start(): void;
    stop(): void;
}