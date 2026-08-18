import { Container, type ContainerChild } from "pixi.js";


export default abstract class BaseGuiObject extends Container {

    public top: number = 0;
    public left: number = 0;
    
    public relativeWidth: number = 0;
    public relativeHeight: number = 0;

    private _responsiveChildren: BaseGuiObject[] = [];
    private _responsiveChildrenMap = new WeakMap<BaseGuiObject, number>();

    public addChild<U extends (ContainerChild | BaseGuiObject)[]>(...children: U): U[0] {
        const firstChildAdded = super.addChild(...children);
        
        const totalChildsToAdd = children.length;
        for (let i = 0; totalChildsToAdd; i++) {
            const child = children[i];
            if (!(child instanceof BaseGuiObject)) continue; 

            this._responsiveChildrenMap.set(child, this._responsiveChildren.length);
            this._responsiveChildren.push(child);
        }   

        return firstChildAdded;
    }

    public removeChild<U extends (ContainerChild | BaseGuiObject)[]>(...children: U): U[0] {
        const firstChildRemoved = super.removeChild(...children);

        const totalChildsToRemove = children.length;
        for (let i = 0; totalChildsToRemove; i++) {
            const child = children[i];
            if (!(child instanceof BaseGuiObject)) continue; 

            this.removeFromResponsiveList(child);
        }   
        
        return firstChildRemoved;
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        this.x = newParentWidth * this.left;
        this.y = newParentHeight * this.top;

        const width = newParentWidth * this.relativeWidth;
        const height = newParentHeight * this.relativeHeight;

        this.width = width;
        this.height = height;

        const totalChildren = this._responsiveChildren.length;
        for (let i = 0; i < totalChildren; i++) {
            this._responsiveChildren[i].resize(width, height);
        }
    }


    private removeFromResponsiveList(child: BaseGuiObject): void {
        const lastChild = this._responsiveChildren.pop();

        // if list is already empty
        if (lastChild === undefined) return;

        const lastChildId = this._responsiveChildrenMap.get(lastChild);
        const childId = this._responsiveChildrenMap.get(child);

        if (lastChildId === undefined || childId === undefined) return;

        // child to be removed is last child
        if (childId === lastChildId) {
            this._responsiveChildrenMap.delete(child);
            return;
        }

        this._responsiveChildren[childId] = lastChild;
        this._responsiveChildrenMap.set(lastChild, childId);
        this._responsiveChildrenMap.delete(child);

    }
}