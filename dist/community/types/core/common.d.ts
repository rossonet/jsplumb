import { UIGroup } from "./group/group";
import { Endpoint } from "./endpoint/endpoint";
import { EndpointSpec } from "./endpoint/endpoint";
import { AnchorSpec } from "./factory/anchor-factory";
import { ConnectorSpec } from "./connector/abstract-connector";
import { FullOverlaySpec, OverlaySpec } from "./overlay/overlay";
import { PaintStyle } from "./styles";
import { Connection } from "./connector/connection-impl";
export declare type UUID = string;
export interface jsPlumbElement<E> {
    _jsPlumbTargetDefinitions: Array<TargetDefinition>;
    _jsPlumbSourceDefinitions: Array<SourceDefinition>;
    _jsplumbid: string;
    _jsPlumbGroup: UIGroup<E>;
    _jsPlumbParentGroup: UIGroup<E>;
    _jspContext?: any;
    _jsPlumbConnections: Dictionary<boolean>;
    _jsPlumbProxies: Array<[Connection, number]>;
}
export interface ConnectParams {
    uuids?: [UUID, UUID];
    source?: Element | Endpoint;
    target?: Element | Endpoint;
    detachable?: boolean;
    deleteEndpointsOnDetach?: boolean;
    endpoint?: EndpointSpec;
    anchor?: AnchorSpec;
    anchors?: [AnchorSpec, AnchorSpec];
    label?: string;
    connector?: ConnectorSpec;
    overlays?: Array<OverlaySpec>;
    endpoints?: [EndpointSpec, EndpointSpec];
    endpointStyles?: [PaintStyle, PaintStyle];
    endpointHoverStyles?: [PaintStyle, PaintStyle];
    endpointStyle?: PaintStyle;
    endpointHoverStyle?: PaintStyle;
    ports?: [string, string];
}
export interface InternalConnectParams<E> extends ConnectParams {
    sourceEndpoint?: Endpoint<E>;
    targetEndpoint?: Endpoint<E>;
    scope?: string;
    type?: string;
    newConnection?: (p: any) => Connection;
}
export interface ConnectionEstablishedParams<E> {
    connection: Connection;
    source: E;
    sourceEndpoint: Endpoint;
    sourceId: string;
    target: E;
    targetEndpoint: Endpoint;
    targetId: string;
}
export interface ConnectionDetachedParams<E> extends ConnectionEstablishedParams<E> {
}
export interface ConnectionMovedParams {
    connection: Connection;
    index: number;
    originalSourceId: string;
    newSourceId: string;
    originalTargetId: string;
    newTargetId: string;
    originalSourceEndpoint: Endpoint;
    newSourceEndpoint: Endpoint;
    originalTargetEndpoint: Endpoint;
    newTargetEndpoint: Endpoint;
}
export interface TypeDescriptor {
    cssClass?: string;
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
    parameters?: any;
    overlays?: Array<OverlaySpec>;
    overlayMap?: Dictionary<FullOverlaySpec>;
    endpoints?: [EndpointSpec, EndpointSpec];
    endpoint?: EndpointSpec;
    anchors?: [AnchorSpec, AnchorSpec];
    anchor?: AnchorSpec;
    detachable?: boolean;
    reattach?: boolean;
    scope?: string;
    connector?: ConnectorSpec;
    mergeStrategy?: string;
}
export interface BehaviouralTypeDescriptor extends TypeDescriptor {
    filter?: string | Function;
    filterExclude?: boolean;
    extract?: Dictionary<string>;
    uniqueEndpoint?: boolean;
    onMaxConnections?: (value: any, event?: any) => any;
    connectionType?: string;
    portId?: string;
    allowLoopback?: boolean;
}
export interface SourceOrTargetDefinition {
    enabled?: boolean;
    def: BehaviouralTypeDescriptor;
    endpoint?: Endpoint;
    maxConnections?: number;
    uniqueEndpoint?: boolean;
}
export interface SourceDefinition extends SourceOrTargetDefinition {
}
export interface TargetDefinition extends SourceOrTargetDefinition {
}
export interface Offset {
    left: number;
    top: number;
}
export declare type Size = [number, number];
export declare type Rotation = number;
export declare type PointArray = [number, number];
export interface PointXY {
    x: number;
    y: number;
    theta?: number;
}
export declare type BoundingBox = {
    x: number;
    y: number;
    w: number;
    h: number;
    center?: PointXY;
};
export declare type RectangleXY = BoundingBox;
export declare type LineXY = [PointXY, PointXY];
export interface UpdateOffsetOptions {
    timestamp?: string;
    recalc?: boolean;
    offset?: Offset;
    elId?: string;
}
export interface ExtendedOffset extends Offset {
    width?: number;
    height?: number;
    centerx?: number;
    centery?: number;
    bottom?: number;
    right?: number;
}
export interface Dictionary<T> {
    [Key: string]: T;
}
export declare type SortFunction<T> = (a: T, b: T) => number;
export declare type Constructable<T> = {
    new (...args: any[]): T;
};
export declare type Timestamp = string;