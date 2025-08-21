import { Args } from "grimoire-kolmafia";
import {
  Item,
  getShop,
  putShop,
  retrieveItem,
  repriceShop,
} from "kolmafia";
import { $items } from "libram";

export default function main(command?: string): void {
  Args.fill(args, command);
  const it = args.item;
  const num = args.number;

  // pick specific item or random one if none provided
  const theItem =
    it !== Item.none
      ? it
      : items[Math.floor(Math.random() * items.length)];

  if (!args.stock) {
    const shop = getShop();
    const quantity = shop[theItem.name] ?? 0;

    if (quantity < num) {
      putShop(100, 1, num, theItem);
    } else {
      repriceShop(theItem, 100);
    }
  } else {
    // Stock all items in `items` up to 33
    const shop = getShop();
    for (const i of items) {
      const quantity = shop[i.name] ?? 0;
      if (quantity < 33) {
        const needed = 33 - quantity;
        retrieveItem(needed, i);
        putShop(999_999_999_999, 1, needed, i);
      }
    }
  }
}

const items = $items`Ambitious Turkey, bad rum and good cola, battery (car), beastly paste, black snowcone, blue snowcone, blood sausage, blood-drive sticker, blue mana, blue snowcone, blue-frosted astral cupcake, borrowed time, box of familiar jacks, boxing day pass, breakfast miracle, bucket of wine, chlorophyll paste, chocolate stolen accordion, 11-leaf clover, affirmation cookie, cloaca cola polar, cold hi meain, cold-filtered water, counterfeit city, crimboysters rockefeller, crystallized pumpkin spice, CSA all-purpose soap, cuppa royal tea, cuppa sobrie tea, cuppa voraci tea, cybeer, cyburger, cyclops eyedrops, daily affirmation: always be collecting, daily affirmation: keep free hate in your heart, Daily Affirmation: Think Win-Lose, day shortener, demonic paste, doc clock's thyme cocktail, dreadsylvanian cold pocket, dreadsylvanian dank and stormy, dreadsylvanian hot pocket, dreadsylvanian sleaze pocket, dreadsylvanian slithery nipple, dreadsylvanian spooky pocket, dreadsylvanian stink pocket, dream of a dog, ectoplasmic paste, elemental paste, emergency margarita, essential tofu, extra time, extra-greasy slider, fancy chocolate, fantasyrealm guest pass, fish juice box, five second energy, frost flower, frosty's frosty mug, gene tonic: elemental, gene tonic: humanoid, gift card`;

const args = Args.create("Run_An_AR", "Be good, be kind", {
  item: Args.item({
    help: `Select a particular item to reprice`,
    default: Item.none,
  }),
  number: Args.number({
    help: `Select a number of tickets to reprice`,
    default: 11,
  }),
  stock: Args.flag({
    help: `When selected, script will stock eligible items at mallmax`,
  }),
});