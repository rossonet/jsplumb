import { Dictionary, Offset } from '../common';
import { JsPlumbInstance } from "../core";
import { Connection } from '../connector/connection-impl';
import { AnchorSpec } from "../factory/anchor-factory";
import { EndpointSpec } from "../endpoint/endpoint";
import { GroupManager } from "../group/group-manager";
export interface GroupOptions {
    id?: string;
    droppable?: boolean;
    enabled?: boolean;
    orphan?: boolean;
    constrain?: boolean;
    proxied?: boolean;
    ghost?: boolean;
    revert?: boolean;
    prune?: boolean;
    dropOverride?: boolean;
    anchor?: AnchorSpec;
    endpoint?: EndpointSpec;
}
export declare class UINode {
    instance: JsPlumbInstance;
    el: any;
    group: UIGroup;
    constructor(instance: JsPlumbInstance, el: any);
}
export declare class UIGroup extends UINode {
    instance: JsPlumbInstance;
    children: Array<any>;
    childGroups: Array<UIGroup>;
    collapsed: boolean;
    droppable: boolean;
    enabled: boolean;
    orphan: boolean;
    constrain: boolean;
    proxied: boolean;
    ghost: boolean;
    revert: boolean;
    prune: boolean;
    dropOverride: boolean;
    anchor: AnchorSpec;
    endpoint: EndpointSpec;
    connections: {
        source: Array<Connection>;
        target: Array<Connection>;
        internal: Array<Connection>;
    };
    groups: Array<UIGroup>;
    manager: GroupManager;
    id: string;
    constructor(instance: JsPlumbInstance, el: any, options: GroupOptions);
    overrideDrop(el: any, targetGroup: UIGroup): boolean;
    getDragArea(): any;
    getAnchor(conn: Connection, endpointIndex: number): AnchorSpec;
    getEndpoint(conn: Connection, endpointIndex: number): EndpointSpec;
    add(_el: any, doNotFireEvent?: boolean): void;
    remove(el: any | Array<any>, manipulateDOM?: boolean, doNotFireEvent?: boolean, doNotUpdateConnections?: boolean, targetGroup?: UIGroup): void;
    removeAll(manipulateDOM?: boolean, doNotFireEvent?: boolean): void;
    private _orphan;
    orphanAll(): Dictionary<Offset>;
    addGroup(group: UIGroup): boolean;
    removeGroup(group: UIGroup): void;
    getGroups(): Array<UIGroup>;
    get collapseParent(): UIGroup;
}