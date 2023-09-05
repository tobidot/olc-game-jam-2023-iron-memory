import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Circle } from "../../library/math/Circle";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { EnemyType } from "../consts/EnemyType";
import { WeaponAchievement } from "../consts/WeaponAchievements";
import { Agent, AgentImageName, AgentImageSet } from "../models/Agent";
import { AiAgent } from "../models/AiAgent";
import { AttackAttributes } from "../models/AttackAttributes";
import { AttackDamage } from "../models/AttackDamage";

export class CreepUnitFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makeGoblin(
        position: Vector2D,
    ) {
        const size = 32;
        const shape = new Circle(position, size / 2);
        const entity = new AiAgent(
            this.game,
            EnemyType.GOBLIN,
            shape,
            this.getImageSet('goblin'),
            ["light"]
        );
        entity.max_hitpoints = entity.hitpoints = 8;
        entity.movement_speed = 150;
        entity.physical_resistance = 1;
        entity.fire_resistance = 0;
        entity.ice_resistance = 0;
        entity.psy_resistance = 0;
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 4, 0, 0, 0),
            48, 48, 0.3, 0
        );
        // entity.
        return entity;
    }

    public makeSpider(
        position: Vector2D,
    ) {
        const size = 24;
        const shape = new Circle(position, size / 2);
        const entity = new AiAgent(
            this.game,
            EnemyType.SPIDER,
            shape,
            this.getImageSet('spider'),
            ["light", "light", "s1"]
        );
        entity.seconds_between_auto_attacks = 0.5;
        entity.max_hitpoints = entity.hitpoints = 4;
        entity.movement_speed = 90;
        entity.physical_resistance = 2;
        entity.fire_resistance = 3;
        entity.ice_resistance = 0;
        entity.psy_resistance = 1;
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 2, 0, 0, 0),
            48, 48, 0.3, 0
        );
        // jump to player
        entity.special_attack_1 = new AttackAttributes(
            new AttackDamage(entity, 0, 0, 0, 0),
            0, 0, 0.25, 0.1,
            (attack) => {
                // debugger;
                const player = this.game.model.walkable_area.hero;
                if (!player) {
                    return;
                }
                const target = player.physics.shape.getCenter();
                const max_jump_distance = 100;
                const distance = Math.min(max_jump_distance, target.cpy().sub(entity.physics.shape.getCenter()).length());
                const direction = target.cpy().sub(entity.physics.shape.getCenter()).normalize();
                entity.physics.shape.move(direction.mul(distance));
            },
        );
        // entity.
        return entity;
    }

    public makeImp(
        position: Vector2D,
    ) {
        const size = 36;
        const shape = new Circle(position, size / 2);
        const entity = new AiAgent(
            this.game,
            EnemyType.IMP,
            shape,
            this.getImageSet('imp'),
            ["light", "heavy"]
        );
        entity.max_hitpoints = entity.hitpoints = 12;
        entity.movement_speed = 100;
        entity.physical_resistance = 3;
        entity.fire_resistance = 3;
        entity.ice_resistance = 0;
        entity.psy_resistance = 1;
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 5, 0, 0, 0),
            48, 48, 0.35, 0
        );
        entity.heavy_attack = new AttackAttributes(
            new AttackDamage(entity, 4, 0, 2, 0),
            72, 48, 0.25, 0.5,
        );
        return entity;
    }

    public makeHobGoblin(
        position: Vector2D,
    ) {
        const size = 72;
        const shape = new Circle(position, size / 2);
        const entity = new AiAgent(
            this.game,
            EnemyType.HOB_GOBLIN,
            shape,
            this.getImageSet('goblin'),
            ["light", "light", "heavy", "s1"],
        );
        entity.seconds_between_auto_attacks = 1;
        entity.max_hitpoints = entity.hitpoints = 90;
        entity.physical_resistance = 20;
        entity.fire_resistance = 5;
        entity.ice_resistance = 5;
        entity.psy_resistance = 0;
        entity.movement_speed = 110;
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 8, 0, 0, 0),
            120, 80, 0.5, 0
        );
        entity.heavy_attack = new AttackAttributes(
            new AttackDamage(entity, 25, 0, 0, 0),
            160, 160, 0.5, 1.5,
        );
        // spawn a goblin 
        entity.special_attack_1 = new AttackAttributes(
            new AttackDamage(entity, 0, 0, 0, 0),
            0, 0, 0.5, 1.5,
            (attack) => {
                const goblin = this.makeGoblin(entity.physics.shape.getCenter().cpy().add(new Vector2D(0, 50)));
                this.game.model.walkable_area.addEntity(goblin);
            },
        );
        // entity.
        return entity;
    }

    public makeOrc(
        position: Vector2D,
    ) {
        const size = 64;
        const shape = new Circle(position, size / 2);
        const entity = new AiAgent(
            this.game,
            EnemyType.ORC,
            shape,
            this.getImageSet('orc'),
            ["light", "heavy", "heavy", "light", "heavy"],
        );
        entity.seconds_between_auto_attacks = 1;
        entity.max_hitpoints = entity.hitpoints = 70;
        entity.physical_resistance = 25;
        entity.fire_resistance = 0;
        entity.ice_resistance = 0;
        entity.psy_resistance = 0;
        entity.movement_speed = 130;
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 8, 0, 0, 0),
            90, 140, 0.3, 0.3
        );
        entity.heavy_attack = new AttackAttributes(
            new AttackDamage(entity, 12, 0, 0, 0),
            140, 90, 0.5, 0.85,
        );
        return entity;
    }


    public makeTroll(
        position: Vector2D,
    ) {
        const size = 64;
        const shape = new Circle(position, size / 2);
        const entity = new AiAgent(
            this.game,
            EnemyType.TROLL,
            shape,
            this.getImageSet('troll'),
            ["light", "light", "light", "s1", "light", "light", "s1"],
        );
        entity.seconds_between_auto_attacks = 1;
        entity.max_hitpoints = entity.hitpoints = 90;
        entity.physical_resistance = 10;
        entity.fire_resistance = 10;
        entity.ice_resistance = 2;
        entity.psy_resistance = 0;
        entity.movement_speed = 100;
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 6, 0, 0, 0),
            32, 220, 0.4, 0.3
        );
        entity.heavy_attack = new AttackAttributes(
            new AttackDamage(entity, 12, 0, 0, 0),
            140, 90, 0.5, 0.9,
        );
        // stop to regen health
        entity.special_attack_1 = new AttackAttributes(
            new AttackDamage(entity, 0, 0, 0, 0),
            0, 0, 0.1, 0.5,
            (attack) => {
                entity.hitpoints = Math.min(entity.max_hitpoints, entity.hitpoints + 10);
                this.game.model.effect_factory.makeDamageText(entity.physics.shape.getCenter(), "10", "green");
            },
        );
        return entity;
    }

    public makeDragon(
        position: Vector2D,
    ) {
        const size = 128;
        const shape = new Circle(position, size / 2);
        const entity = new AiAgent(
            this.game,
            EnemyType.DRAGON,
            shape,
            this.getImageSet('dragon'),
            ["light", "light", "light", "heavy", "s1"],
        );
        entity.seconds_between_auto_attacks = 2;
        entity.max_hitpoints = entity.hitpoints = 250;
        entity.physical_resistance = 50;
        entity.ice_resistance = 5;
        entity.psy_resistance = 4;
        entity.fire_resistance = 100;
        entity.movement_speed = 80;
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 16, 0, 16, 0),
            128, 128, 1.0, 1.2
        );
        entity.heavy_attack = new AttackAttributes(
            new AttackDamage(entity, 12, 0, 0, 0),
            256, 256, 1.0, 2.5,
        );
        // debuff player 
        entity.special_attack_1 = new AttackAttributes(
            new AttackDamage(entity, 0, 0, 0, 0),
            0, 0, 0.5, 0.5,
            (attack) => {
                const player = this.game.model.walkable_area.hero;
                if (!player) {
                    return;
                }
                // progress achievement to corrosive the sword damage
                player.weapon.increase(WeaponAchievement.DRAGONS_CURSE, 1);
                player.weapon.increase(WeaponAchievement.DRAGONS_CURSE_5, 1);
            },
        );
        return entity;
    }


    public makeDemon(
        position: Vector2D,
    ) {
        const size = 100;
        const shape = new Circle(position, size / 2);
        const entity = new AiAgent(
            this.game,
            EnemyType.DEMON,
            shape,
            this.getImageSet('demon'),
            ["light", "s1", "light", "s2", "light", "s1", "heavy",],
        );
        entity.seconds_between_auto_attacks = 0.5;
        entity.max_hitpoints = entity.hitpoints = 160;
        entity.physical_resistance = 30;
        entity.ice_resistance = 2;
        entity.psy_resistance = 30;
        entity.fire_resistance = 40;
        entity.movement_speed = 120;
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 0, 8, 8, 0),
            100, 128, 0.3, 0
        );
        entity.heavy_attack = new AttackAttributes(
            new AttackDamage(entity, 0, 16, 0, 0),
            100, 312, 1.0, 1.2,
        );
        // spawn imps
        entity.special_attack_1 = new AttackAttributes(
            new AttackDamage(entity, 0, 5, 0, 0),
            0, 0, 1.0, 0.75,
            (attack) => {
                const position = entity.physics.shape.getCenter().cpy().add(new Vector2D(0, 50));
                for (let i = 0; i < 2; i++) {
                    const imp = this.makeImp(position);
                    this.game.model.walkable_area.addEntity(imp);
                }

            },
        );
        // demon curse  
        entity.special_attack_2 = new AttackAttributes(
            new AttackDamage(entity, 0, 0, 42, 0),
            512, 80, 0.75, 0.5,
            (attack) => {
                const player = this.game.model.walkable_area.hero;
                if (!player) {
                    return;
                }
                // progress achievement to corrosive the sword damage
                player.weapon.increase(WeaponAchievement.DEMONS_CURSE, 1);
                player.weapon.increase(WeaponAchievement.DEMONS_CURSE_5, 1);
            },
        );
        return entity;
    }

    public makeLich(
        position: Vector2D,
    ) {
        const size = 112;
        const shape = new Circle(position, size / 2);
        const entity = new AiAgent(
            this.game,
            EnemyType.LICH,
            shape,
            this.getImageSet('lich'),
            ["light", "s1", "s1", "light", "s2", "s3"],
        );
        entity.seconds_between_auto_attacks = 0.5;
        entity.max_hitpoints = entity.hitpoints = 120;
        entity.physical_resistance = 25;
        entity.ice_resistance = 25;
        entity.psy_resistance = 10;
        entity.fire_resistance = 10;
        entity.movement_speed = 40;
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 0, 0, 0, 10),
            100, 128, 0.3, 0
        );
        // spwan imp
        entity.special_attack_1 = new AttackAttributes(
            new AttackDamage(entity, 0, 0, 0, 0),
            0, 0, 0.25, 0.85,
            (attack) => {
                const position = entity.physics.shape.getCenter().cpy().add(new Vector2D(0, 50));
                for (let i = 0; i < 2; i++) {
                    const imp = this.makeImp(position);
                    this.game.model.walkable_area.addEntity(imp);
                }
            },
        );
        // spawn spider
        entity.special_attack_2 = new AttackAttributes(
            new AttackDamage(entity, 0, 5, 0, 0),
            0, 0, 0.5, 1.0,
            (attack) => {
                const position = entity.physics.shape.getCenter().cpy().add(new Vector2D(0, 50));
                for (let i = 0; i < 2; i++) {
                    const spider = this.makeSpider(position);
                    this.game.model.walkable_area.addEntity(spider);
                }
            },
        );
        // death and decay, hit anywhere
        entity.special_attack_3 = new AttackAttributes(
            new AttackDamage(entity, 0, 0, 0, 5),
            0, 0, 1.0, 0.5,
            (attack) => {
                const player = this.game.model.walkable_area.hero;
                if (!player) {
                    return;
                }
                player.applyDamage(attack.damage);
            },
        );
        return entity;
    }




    public getImageSet(type: keyof typeof image_sets): AgentImageSet {
        const images = image_sets[type]
            .map(
                ([key, image_name]): [AgentImageName, ImageAsset] => [key, this.game.assets.getImage(image_name)]
            );
        return new Map<AgentImageName, ImageAsset>(images);
    }
}

const image_sets = {
    goblin: [[AgentImageName.DEFAULT, Assets.images.area.goblin],],
    spider: [[AgentImageName.DEFAULT, Assets.images.area.spider],],
    imp: [[AgentImageName.DEFAULT, Assets.images.area.imp],],
    hob_goblin: [[AgentImageName.DEFAULT, Assets.images.area.hob_goblin],],
    orc: [[AgentImageName.DEFAULT, Assets.images.area.orc],],
    troll: [[AgentImageName.DEFAULT, Assets.images.area.troll],],
    demon: [[AgentImageName.DEFAULT, Assets.images.area.demon],],
    lich: [[AgentImageName.DEFAULT, Assets.images.area.lich],],
    dragon: [[AgentImageName.DEFAULT, Assets.images.area.dragon],],
} as const;