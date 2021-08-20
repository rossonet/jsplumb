<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jsplumb/util](./util.md) &gt; [pointOnLine](./util.pointonline.md)

## pointOnLine() function

Calculates a point on the line from `fromPoint` to `toPoint` that is `distance` units along the length of the line.

<b>Signature:</b>

```typescript
export declare function pointOnLine(fromPoint: PointXY, toPoint: PointXY, distance: number): PointXY;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  fromPoint | [PointXY](./util.pointxy.md) | First point |
|  toPoint | [PointXY](./util.pointxy.md) | Second point |
|  distance | number | Distance along the length that the point should be located. |

<b>Returns:</b>

[PointXY](./util.pointxy.md)

Point on the line, in the form `{ x:..., y:... }`<!-- -->.
