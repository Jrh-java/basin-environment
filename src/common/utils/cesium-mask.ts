import * as Cesium from "cesium"

/**
 * 添加反向遮罩与边界线
 * @param viewer Cesium Viewer 实例
 * @param geoJsonUrl GeoJSON 文件路径
 * @param maskColor 遮罩颜色 (默认蓝色半透明)
 * @param lineColor 边界线颜色 (默认淡蓝色)
 * @param lineWidth 边界线宽度
 * @param flyTo 是否飞向该区域
 */
export async function addInverseMask(
  viewer: Cesium.Viewer,
  geoJsonUrl: string,
  options: {
    maskColor?: Cesium.Color
    lineColor?: Cesium.Color
    lineWidth?: number
    flyTo?: boolean
  } = {}
) {
  try {
    const response = await fetch(geoJsonUrl)
    if (!response.ok) throw new Error("GeoJSON 加载失败")
    const data = await response.json()

    // 假设 GeoJSON 结构为 FeatureCollection，取第一个 Feature 的 MultiPolygon 或 Polygon
    const feature = data.features?.[0]
    if (!feature) throw new Error("GeoJSON 数据格式不正确")

    const geometry = feature.geometry
    let coordinates: any[] = []

    // 处理 Polygon 和 MultiPolygon
    if (geometry.type === "Polygon") {
      coordinates = geometry.coordinates[0]
    } else if (geometry.type === "MultiPolygon") {
      // 取第一个多边形的外环，如果有多个多边形需按需处理，这里简化处理取第一个
      coordinates = geometry.coordinates[0][0]
    } else {
      throw new Error("不支持的几何类型，仅支持 Polygon 或 MultiPolygon")
    }

    // 提取边界点数组 [lon, lat, lon, lat, ...]
    const positionsArray: number[] = []
    for (let i = 0; i < coordinates.length; i++) {
      positionsArray.push(coordinates[i][0])
      positionsArray.push(coordinates[i][1])
    }

    const maskPoints = Cesium.Cartesian3.fromDegreesArray(positionsArray)

    // 1. 添加反向遮罩 (Polygon with holes)
    // 外部区域覆盖全球，挖空目标区域
    const outerPositions = Cesium.Cartesian3.fromDegreesArray([
      100,
      0,
      100,
      89,
      150,
      89,
      150,
      0
    ])

    const holeHierarchy = new Cesium.PolygonHierarchy(maskPoints)
    const hierarchy = new Cesium.PolygonHierarchy(outerPositions, [holeHierarchy])

    const maskEntity = new Cesium.Entity({
      polygon: {
        hierarchy,
        material: Cesium.Color.BLACK.withAlpha(0.5) // 遮罩颜色
        // height: 0, // 不设置 height 以启用贴地模式 (Clamped to ground)
      }
    })
    viewer.entities.add(maskEntity)

    // 2. 添加边界线
    const lineEntity = new Cesium.Entity({
      polyline: {
        positions: maskPoints,
        width: options.lineWidth || 2,
        material: options.lineColor || Cesium.Color.fromCssColorString("#6dcdeb"),
        clampToGround: true // 贴地线
      }
    })
    viewer.entities.add(lineEntity)

    // 3. 定位
    if (options.flyTo !== false) {
      viewer.zoomTo(lineEntity)
    }
  } catch (error) {
    console.error("添加反向遮罩失败:", error)
    throw error
  }
}
