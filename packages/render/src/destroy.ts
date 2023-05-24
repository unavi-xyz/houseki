import { Mut, Res } from "thyseus";

import { RenderStore } from "./RenderStore";
import { disposeMaterial } from "./utils/dispose";

export function destroy(renderStore: Res<Mut<RenderStore>>) {
  renderStore.renderer.dispose();

  renderStore.materials.forEach(disposeMaterial);
  renderStore.materials.clear();

  renderStore.geometries.forEach((geometry) => geometry.dispose());
  renderStore.geometries.clear();
}