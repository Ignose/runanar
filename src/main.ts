import { Args } from "grimoire-kolmafia";
import { getShop, Item, putShop, repriceShop, retrieveItem, retrievePrice } from "kolmafia";
import { $items } from "libram";

export default function main(command?: string): void {
  Args.fill(args, command);
  const it = args.item;
  const num = args.number;

  // pick specific item or random one if none provided
  const theItem = it !== Item.none ? it : items[Math.floor(Math.random() * items.length)];

  if (!args.stock) {
    const shop = getShop();
    const quantity = shop[theItem.name] ?? 0;

    if (quantity < num) {
      putShop(100, 1, num, theItem);
    } else {
      repriceShop(100, theItem);
    }
  } else {
    // Stock all items in `items` up to 33
    const shop = getShop();
    for (const i of items) {
      const quantity = shop[i.name] ?? 0;
      if (quantity < 33) {
        const needed = 33 - quantity;
        if (retrievePrice(i) > 500_000) throw `${i} was too expensive, check what went wrong!`;
        retrieveItem(needed, i);
        putShop(999_999_999_999, 1, needed, i);
      }
    }
  }
}

const items = $items`Ambitious Turkey, bad rum and good cola, battery (car), beastly paste, black snowcone, blue snowcone, blood sausage, blood-drive sticker, blue mana, blue snowcone, blue-frosted astral cupcake, borrowed time, box of Familiar Jacks, Boxing Day Pass, breakfast miracle, bucket of wine, chlorophyll paste, chocolate stolen accordion, 11-leaf clover, Affirmation Cookie, Cloaca Cola Polar, cold hi mein, cold-filtered water, counterfeit city, Crimboysters Rockefeller, crystallized pumpkin spice, CSA all-purpose soap, cuppa Royal tea, cuppa Sobrie tea, cuppa Voraci tea, cybeer, cyburger, cyclops eyedrops, Daily Affirmation: Always be Collecting, Daily Affirmation: Keep Free Hate in your Heart, Daily Affirmation: Think Win-Lose, day shortener, demonic paste, Doc Clock's thyme cocktail, Dreadsylvanian cold pocket, Dreadsylvanian dank and stormy, Dreadsylvanian hot pocket, Dreadsylvanian sleaze pocket, Dreadsylvanian slithery nipple, Dreadsylvanian spooky pocket, Dreadsylvanian stink pocket, dream of a dog, ectoplasmic paste, elemental paste, emergency margarita, essential tofu, extra time, extra-greasy slider, fancy chocolate, FantasyRealm guest pass, fish juice box, Five Second Energy™, frost flower, Frosty's frosty mug, Gene Tonic: Elemental, Gene Tonic: Humanoid, gift card`;

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
