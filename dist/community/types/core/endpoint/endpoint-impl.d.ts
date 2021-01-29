import { EndpointSpec, InternalEndpointOptions } from "../endpoint/endpoint";
import { JsPlumbInstance } from "../core";
import { AnchorSpec } from "../factory/anchor-factory";
import { Anchor } from "../anchor/anchor";
import { OverlayCapableComponent } from "../component/overlay-capable-component";
import { Connection } from "../connector/connection-impl";
import { PaintStyle } from "../styles";
import { ConnectorSpec } from "../connector/abstract-connector";
import { EndpointRepresentation } from "./endpoints";
import { OverlaySpec } from '../overlay/overlay';
export declare class Endpoint<E = any> extends OverlayCapableComponent {
    instance: JsPlumbInstance;
    getIdPrefix(): string;
    getTypeDescriptor(): string;
    getXY(): {
        x: number;
        y: number;
    };
    connections: Array<Connection>;
    anchor: Anchor;
    endpoint: EndpointRepresentation<any>;
    element: E;
    elementId: string;
    dragAllowedWhenFull: boolean;
    timestamp: string;
    portId: string;
    floatingEndpoint: EndpointRepresentation<any>;
    maxConnections: number;
    connectorClass: string;
    connectorHoverClass: string;
    _originalAnchor: AnchorSpec;
    deleteAfterDragStop: boolean;
    finalEndpoint: Endpoint<E>;
    enabled: boolean;
    isSource: boolean;
    isTarget: boolean;
    isTemporarySource: boolean;
    connectionCost: number;
    connectionsDirected: boolean;
    connectionsDetachable: boolean;
    reattachConnections: boolean;
    currentAnchorClass: string;
    referenceEndpoint: Endpoint<E>;
    connectionType: string;
    connector: ConnectorSpec;
    connectorOverlays: Array<OverlaySpec>;
    connectorStyle: PaintStyle;
    connectorHoverStyle: PaintStyle;
    dragProxy: any;
    deleteOnEmpty: boolean;
    private uuid;
    scope: string;
    defaultLabelLocation: [number, number];
    getDefaultOverlayKey(): string;
    constructor(instance: JsPlumbInstance, params: InternalEndpointOptions<E>);
    private _updateAnchorClass;
    private prepareAnchor;
    setPreparedAnchor(anchor: Anchor): Endpoint;
    setAnchor(anchorParams: any): Endpoint;
    addConnection(conn: Connection): void;
    /**
     * Detaches this Endpoint from the given Connection.  If `deleteOnEmpty` is set to true and there are no
     * Connections after this one is detached, the Endpoint is deleted.
     * @param connection
     * @param idx
     */
    detachFromConnection(connection: Connection, idx?: number, transientDetach?: boolean): void;
    deleteEveryConnection(params?: any): void;
    detachFrom(targetEndpoint: Endpoint): Endpoint;
    setVisible(v: boolean, doNotChangeConnections?: boolean, doNotNotifyOtherEndpoint?: boolean): void;
    applyType(t: any, typeMap: any): void;
    destroy(force?: boolean): void;
    isFull(): boolean;
    isFloating(): boolean;
    isConnectedTo(endpoint: Endpoint): boolean;
    setElementId(_elId: string): void;
    setDragAllowedWhenFull(allowed: boolean): void;
    equals(endpoint: Endpoint): boolean;
    getUuid(): string;
    connectorSelector(): Connection;
    prepareEndpoint<C>(ep: EndpointSpec | EndpointRepresentation<C>, typeId?: string): EndpointRepresentation<C>;
    setEndpoint(ep: EndpointSpec): void;
    setPreparedEndpoint<C>(ep: EndpointRepresentation<C>): void;
    addClass(clazz: string, dontUpdateOverlays?: boolean): void;
    removeClass(clazz: string, dontUpdateOverlays?: boolean): void;
}