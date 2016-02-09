# IWC performance Prototype

## how to IWC
first `npm install` in `root` AND `app/` then run `gulp watch` and eveything should be fine

## changes to THREE.Object3D
you can add a `update(dt, stage)` function to your THREE.Object3D Instances that will automatically be called when added to the scene, or any children, childrens children ... of the scene. Arguments it will receive are `dt`, deltaTime since the last call and `stage` which will have stuff like the renderer, scene and camera.


Disable the update (not rendering) of an object and its children by setting Object.active = false

