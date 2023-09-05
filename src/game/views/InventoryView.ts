import { GameModel } from "../models/GameModel";
import { ViewSettings } from "../../library/abstract/mvc/View";
import { AttackAttributes } from "../models/AttackAttributes";
import { Vector2D } from "../../library/math";

export class InventoryView {

    public constructor(
        public context: CanvasRenderingContext2D,
        public settings: ViewSettings,
    ) {
    }

    public update(delta_ms: number): void {
        // do nothing
    }

    /**
     * Render the complete game state
     * @param model 
     */
    public render(model: GameModel): void {
        const hero = model.walkable_area.hero;
        if (!hero) {
            return;
        }
        const left_x = 250;
        const right_x = 550;
        this.context.save();
        this.context.textAlign = "center";
        this.context.fillStyle = "#fff";
        this.context.font = "24px sans-serif";
        this.context.fillText("Character", (left_x + right_x) / 2, 50);
        //
        this.context.textAlign = "left";
        this.context.font = "16px sans-serif";
        // 
        this.context.fillText("Health: ", left_x, 80);
        this.context.fillText("Movement Speed: ", left_x, 100);
        this.context.fillText("Physical Resistance: ", left_x, 120);
        this.context.fillText("Fire Resisitance: ", left_x, 140);
        this.context.fillText("Ice Resistance: ", left_x, 160);
        this.context.fillText("Psy Resisitance: ", left_x, 180);

        this.context.textAlign = "right";
        this.context.fillText(hero.hitpoints.toFixed(2) + " / " + hero.max_hitpoints.toFixed(2), right_x, 80);
        this.context.fillText(hero.movement_speed.toString(), right_x, 100);
        this.context.fillStyle = "#fff";
        this.context.fillText(hero.physical_resistance.toString(), right_x, 120);
        this.context.fillStyle = "red";
        this.context.fillText(hero.fire_resistance.toString(), right_x, 140);
        this.context.fillStyle = "aqua";
        this.context.fillText(hero.ice_resistance.toString(), right_x, 160);
        this.context.fillStyle = "hotpink";
        this.context.fillText(hero.psy_resistance.toString(), right_x, 180);
        //

        const light_attack = hero.getLightAttackStruct();
        this.renderAttackAttributes(light_attack, 20, 220, 'Light Attack');
        const heavy_attack = hero.getHeavyAttackStruct();
        this.renderAttackAttributes(heavy_attack, 520, 220, 'Heavy Attack');
    }

    public renderAttackAttributes(
        attackAttributes: AttackAttributes,
        xOffset: number,
        yOffset: number,
        name: string
    ) {
        const ctx = this.context;

        // // Create a bounding box for each attack display
        // const boxWidth = 180;
        // const boxHeight = 180;
        // ctx.fillStyle = 'lightgray';
        // ctx.fillRect(xOffset, 10, boxWidth, boxHeight);
        // ctx.strokeRect(xOffset, 10, boxWidth, boxHeight);

        // Attack Name (you can customize this based on your player's attacks)
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(name, xOffset + 100, 30 + yOffset);

        //
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';

        // Damage Values
        ctx.fillStyle = 'white';
        ctx.fillText('Physical Damage:', xOffset + 20, 60 + yOffset);
        ctx.fillText(attackAttributes.damage.physical.toFixed(0), xOffset + 170, 60 + yOffset);

        ctx.fillStyle = 'red'; // Red color for fire damage
        ctx.fillText('Fire Damage:', xOffset + 20, 80 + yOffset);
        ctx.fillText(attackAttributes.damage.fire.toFixed(0), xOffset + 170, 80 + yOffset);

        ctx.fillStyle = 'aqua';
        ctx.fillText('Ice Damage:', xOffset + 20, 100 + yOffset);
        ctx.fillText(attackAttributes.damage.ice.toFixed(0), xOffset + 170, 100 + yOffset);

        ctx.fillStyle = 'hotpink';
        ctx.fillText('Psy Damage:', xOffset + 20, 120 + yOffset);
        ctx.fillText(attackAttributes.damage.psy.toFixed(0), xOffset + 170, 120 + yOffset);

        // Other Attributes
        ctx.fillStyle = 'white';
        ctx.fillText('Attack Width:', xOffset + 20, 180 + yOffset);
        ctx.fillText(attackAttributes.attack_width.toFixed(0), xOffset + 170, 180 + yOffset);

        ctx.fillText('Attack Range:', xOffset + 20, 200 + yOffset);
        ctx.fillText(attackAttributes.attack_range.toFixed(0), xOffset + 170, 200 + yOffset);

        ctx.fillText('Cooldown (s):', xOffset + 20, 220 + yOffset);
        ctx.fillText(attackAttributes.cooldown_seconds.toFixed(2), xOffset + 170, 220 + yOffset);

        ctx.fillText('Channel (s):', xOffset + 20, 240 + yOffset);
        ctx.fillText(attackAttributes.channel_seconds.toFixed(2), xOffset + 170, 240 + yOffset);
    }
}