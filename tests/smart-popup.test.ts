import { mount } from "@vue/test-utils"
import { describe, expect, it, vi } from "vitest"
import SmartPopup from "@/pages/dashboard/components/SmartPopup.vue"

vi.mock("cesium", () => {
  class Cartesian2 {
    constructor(public x: number, public y: number) {}
  }
  return {
    SceneTransforms: {
      worldToWindowCoordinates: vi.fn(() => new Cartesian2(100, 200))
    },
    Cartesian3: {
      fromDegrees: vi.fn(() => ({ lon: 120, lat: 30 }))
    }
  }
})

describe("smartPopup", () => {
  const viewerStub: any = {
    scene: {
      postRender: {
        addEventListener: (fn: any) => fn,
        removeEventListener: (_fn: any) => {}
      }
    },
    canvas: {
      getBoundingClientRect: () => ({ width: 800, height: 600 })
    }
  }

  it("renders title and content, positions correctly", async () => {
    const wrapper = mount(SmartPopup, {
      props: {
        viewer: viewerStub,
        title: "测试标题",
        content: "<b>内容</b>",
        longitude: 120,
        latitude: 30
      }
    })
    const el = wrapper.find(".smart-popup").element as HTMLElement
    expect(wrapper.find(".smart-popup__title").text()).toBe("测试标题")
    expect(wrapper.html()).toContain("<b>内容</b>")
    expect(el.style.left).toBe("100px")
    expect(el.style.top).toBe("200px")
  })

  it("emits close when clicking close button", async () => {
    const wrapper = mount(SmartPopup, {
      props: {
        viewer: viewerStub,
        title: "关闭测试",
        content: "内容",
        longitude: 120,
        latitude: 30
      }
    })
    await wrapper.find(".smart-popup__close").trigger("click")
    expect(wrapper.emitted().close).toBeTruthy()
  })
})
