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
    /** Type 为light时 text必传 */
    type: 'puzzle' | 'light';
    /** 点选文字 */
    text?: string;
    /** 验证成功钩子 */
    onSuccess?: () => void;
    /** 验证失败钩子 */
    onFail?: () => void;
    /** 点击刷新钩子 */
    onRefresh?: () => void;
}
interface Click {
    x: number;
    y: number;
}
interface Coord {
    x: number;
    y: number;
    size: number;
    deg: number;
    text: string;
}
declare class Behavior {
    protected Mark: HTMLElement;
    protected canvas: HTMLCanvasElement;
    protected block: HTMLCanvasElement;
    protected canvasCtx: CanvasRenderingContext2D;
    protected blockCtx: CanvasRenderingContext2D;
    protected loadingContainer: HTMLElement;
    protected sliderMask: HTMLElement;
    protected sliderIcon: HTMLElement;
    protected Img: HTMLImageElement;
    protected config: BehaviorOption;
    protected coordList: Coord[];
    protected clickList: Click[];
    constructor(ops: BehaviorOption);
    /**
     * 初始化拼图Dom
     */
    initPuzzleDOM(): void;
    /**
     * 初始化点选Dom
     */
    initLightDOM(): void;
    /**
     * 创建图片实例
     *
     * @param onload Image实例onload事件
     * @returns Image实例
     */
    createImg(onload: () => void): HTMLImageElement;
    /**
     * 初始化拼图Canvas
     * @returns
     */
    initPuzzleCanvas(): void;
    /**
     * 绘制拼图缺口
     *
     * @param ctx canvas画布
     * @param fill  是否使用fill方法 背景图true 滑块false
     */
    drawCanvas(ctx: CanvasRenderingContext2D, fill?: boolean): void;
    /**
     * 初始化点选Canvas
     * @returns
     */
    initLightCanvas(): void;
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
     * 添加点选Mark
     */
    addMark(x: number, y: number): void;
    /**
     * 判断点选Mark
     */
    judgeMark(): void;
    /**
     * 拼图移动事件
     */
    TouchEvent(): void;
    /**
     * 点选点击事件
     */
    clickEvent(): void;
    /**
     * 重置拼图
     * @returns
     */
    reset(): void;
    init(): void;
}
export { Behavior };
