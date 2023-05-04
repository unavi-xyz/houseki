import { System, system } from "@lastolivegames/becsy";
import { Node, Parent } from "@lattice-engine/core";
import { Object3D } from "three";

import { NodeObject } from "../components";
import { Renderer } from "../Renderer";

/**
 * Converts Node components to Three.js objects.
 */
@system((s) => s.before(Renderer))
export class NodeBuilder extends System {
  readonly #objects = this.query((q) => q.with(NodeObject).write);
  readonly #parents = this.query((q) => q.with(Parent));

  readonly #addedNodes = this.query((q) => q.added.with(Node));
  readonly #addedOrChangedNodes = this.query(
    (q) => q.addedOrChanged.with(Node).trackWrites
  );
  readonly #removedNodes = this.query((q) => q.removed.with(Node));

  override execute() {
    // Create objects
    for (const entity of this.#addedNodes.added) {
      const object = new Object3D();
      entity.add(NodeObject, { object });
    }

    // Sync objects
    for (const entity of this.#addedOrChangedNodes.addedOrChanged) {
      const node = entity.read(Node);
      const object = entity.read(NodeObject).object;

      object.position.fromArray(node.position);
      object.quaternion.fromArray(node.rotation);
      object.scale.fromArray(node.scale);

      if (entity.has(Parent)) {
        const parent = entity.read(Parent).value;
        const parentObject = parent.read(NodeObject).object;
        parentObject.add(object);
      }
    }

    // Remove objects
    for (const entity of this.#removedNodes.removed) {
      const object = entity.read(NodeObject).object;
      object.removeFromParent();
      object.clear();

      entity.remove(NodeObject);
    }
  }
}
