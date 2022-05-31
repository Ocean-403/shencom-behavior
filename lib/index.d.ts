import './index.scss';
export interface BehaviorOption {
    /** dom */
    el: HTMLElement;
    /** 高度 */
    height: number;
    /** 宽度 */
    width: number;
    /** 背景图Url */
    url?: string;
    /** 验证成功钩子 */
    onSuccess?: () => void;
    /** 验证失败钩子 */
    onFail?: () => void;
    /** 点击刷新钩子 */
    onRefresh?: () => void;
}
declare class Behavior {
    protected canvas: HTMLCanvasElement;
    protected block: HTMLCanvasElement;
    protected canvasCtx: CanvasRenderingContext2D;
    protected blockCtx: CanvasRenderingContext2D;
    protected loadingContainer: HTMLElement;
    protected sliderMask: HTMLElement;
    protected sliderIcon: HTMLElement;
    protected Img: HTMLImageElement;
    protected config: BehaviorOption;
    constructor(ops: BehaviorOption);
    initDOM(): void;
    /**
     * 创建图片实例
     *
     * @param onload Image实例onload事件
     * @returns Image实例
     */
    createImg(onload: () => void): HTMLImageElement;
    initCanvas(): void;
    /**
     * 绘制拼图缺口
     *
     * @param ctx canvas画布
     * @param fill  是否使用fill方法 背景图true 滑块false
     */
    drawCanvas(ctx: CanvasRenderingContext2D, fill?: boolean): void;
    /**
     * 验证是否成功拼图及真人操作
     *
     * @returns
     */
    verify(): {
        spliced: boolean;
        verified: boolean;
    };
    /**
     * 拼图移动事件
     */
    TouchEvent(): void;
    /**
     * 重置拼图
     * @returns
     */
    reset(): void;
    init(): void;
}
export { Behavior };
