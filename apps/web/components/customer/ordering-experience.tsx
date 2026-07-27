"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  CreditCard,
  Droplets,
  Gift,
  MapPin,
  MessageCircle,
  Minus,
  PartyPopper,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  UserRound,
  UtensilsCrossed,
  WalletCards,
  Car,
  Hotel,
  Scissors,
  Stethoscope,
  Wrench,
  Compass
} from "lucide-react";
import { EmptyState, OfflineState, Alert, Badge, Button } from "@business-os/ui";
import {
  createPublicOrder,
  createPublicReservation,
  createWaiterRequest,
  getPublicCategories,
  getPublicMenu,
  getPublicOrder,
  getPublicRestaurant,
  getTableActiveBooking,
} from "@/services/public.service";
import {
  bookEvent,
  bookTable,
  createOrder,
  getFeaturedRestaurants,
  getMenuCategories,
  getOrder,
  getRestaurantDetail,
  getRestaurantMenu,
  getRestaurantsByOffering,
  searchRestaurants,
  validateCoupon,
  type EventBooking,
  type Restaurant,
} from "@/services/online-ordering.service";

type Tab = "menu" | "table" | "event" | "track";
type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  veg: boolean;
  available: boolean;
};
type CartLine = Item & { quantity: number };
type Place = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  cuisine: string[];
  rating: number;
  reviews: number;
  eta: number;
  delivery: number;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  offer: number;
  open: boolean;
};

const foodImages = [
  "/images/paneer_butter_masala.png",
  "/images/chicken_biryani.png",
  "/images/veg_pizza.png",
  "/images/cold_coffee.png",
];
const demoPlaces: Place[] = [
  {
    id: "demo-1",
    name: "Olive & Ember",
    slug: "olive-ember",
    description:
      "Seasonal plates, warm service and a kitchen built around fresh ingredients.",
    image: foodImages[0],
    cuisine: ["Indian", "Continental"],
    rating: 4.8,
    reviews: 1240,
    eta: 28,
    delivery: 39,
    address: "12 Market Street, Central District",
    phone: "+91 98765 43210",
    latitude: 19.076,
    longitude: 72.8777,
    offer: 20,
    open: true,
  },
  {
    id: "demo-2",
    name: "Saffron Social",
    slug: "saffron-social",
    description: "Comforting regional favourites with bright modern flavours.",
    image: foodImages[1],
    cuisine: ["North Indian", "Desserts"],
    rating: 4.6,
    reviews: 860,
    eta: 34,
    delivery: 29,
    address: "88 Garden Road, City Centre",
    phone: "+91 98765 41020",
    latitude: 19.082,
    longitude: 72.884,
    offer: 15,
    open: true,
  },
  {
    id: "demo-3",
    name: "The Green Table",
    slug: "green-table",
    description: "Plant-forward bowls, grills and everyday good food.",
    image: foodImages[2],
    cuisine: ["Healthy", "Asian"],
    rating: 4.7,
    reviews: 642,
    eta: 24,
    delivery: 0,
    address: "6 Lake View, West End",
    phone: "+91 98765 40030",
    latitude: 19.071,
    longitude: 72.865,
    offer: 10,
    open: true,
  },
];
const demoItems: Item[] = [
  {
    id: "d1",
    name: "Charred Paneer Bowl",
    description: "Tandoor paneer, herbed rice, greens and mint yoghurt.",
    price: 329,
    image: foodImages[0],
    category: "Bestsellers",
    veg: true,
    available: true,
  },
  {
    id: "d2",
    name: "Garden Mezze Plate",
    description: "Hummus, crisp vegetables, warm flatbread and pickles.",
    price: 289,
    image: foodImages[2],
    category: "Starters",
    veg: true,
    available: true,
  },
  {
    id: "d3",
    name: "Smoked Chicken Tikka",
    description: "Tender chicken, house spices and coriander chutney.",
    price: 379,
    image: "/images/tandoori_tikka.png",
    category: "Mains",
    veg: false,
    available: true,
  },
  {
    id: "d4",
    name: "Saffron Cold Coffee",
    description: "Slow brewed coffee, saffron cream and pistachio.",
    price: 219,
    image: foodImages[3],
    category: "Drinks",
    veg: true,
    available: true,
  },
];
const onlineSteps = [
  "Received",
  "Accepted",
  "Preparing",
  "Ready",
  "Picked up",
  "On the way",
  "Delivered",
];
const tableSteps = [
  "Received",
  "Accepted",
  "Preparing",
  "Ready",
  "Serving",
  "Served",
];
const statusIndex: Record<string, number> = {
  pending: 0,
  received: 0,
  accepted: 1,
  confirmed: 1,
  preparing: 2,
  ready: 3,
  picked_up: 4,
  serving: 4,
  in_delivery: 5,
  served: 5,
  delivered: 6,
};
const waiterActions = [
  { label: "Need Water", icon: Droplets },
  { label: "Call Waiter", icon: UserRound },
  { label: "Clean Table", icon: Sparkles },
  { label: "Need Bill", icon: CreditCard },
] as const;
const tabs = [
  { value: "menu", label: "Menu", icon: UtensilsCrossed },
  { value: "table", label: "Book table", icon: CalendarDays },
  { value: "event", label: "Events", icon: PartyPopper },
  { value: "track", label: "Track order", icon: Truck },
] as const;

const money = (value: number) =>
  "Rs. " + Math.round(value).toLocaleString("en-IN");
const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");
const fromRestaurant = (restaurant: Restaurant): Place => ({
  id: restaurant.id,
  name: restaurant.name,
  slug: restaurant.slug,
  description:
    restaurant.description ||
    "Fresh food, thoughtful service and memorable meals.",
  image: restaurant.imageUrl || foodImages[0],
  cuisine: restaurant.cuisine || ["Multi-cuisine"],
  rating: restaurant.rating || 4.5,
  reviews: restaurant.reviewCount || 0,
  eta: restaurant.deliveryTime || 30,
  delivery: restaurant.deliveryCharge || 0,
  address: restaurant.address || "Restaurant address available at checkout",
  phone: restaurant.phone || "",
  latitude: restaurant.latitude || 19.076,
  longitude: restaurant.longitude || 72.8777,
  offer: restaurant.offerPercentage || 0,
  open: restaurant.isOpen !== false,
});

export default function UnifiedOrderingExperience() {
  const query = useSearchParams();
  const pathname = usePathname();
  const slug = query.get("restaurant") || query.get("slug") || "";
  const tableId = query.get("table") || "";
  const qrToken = query.get("token") || undefined;
  const bookingId = query.get("booking") || undefined;
  const isTable = Boolean(slug && tableId);
  const [places, setPlaces] = useState<Place[]>(demoPlaces);
  const [place, setPlace] = useState<Place | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  
  const initialTab = useMemo<Tab>(() => {
    if (!pathname) return "menu";
    if (pathname.includes("/track") || pathname.includes("/order")) return "track";
    if (pathname.includes("/table") || pathname.includes("/reservation")) return "table";
    if (pathname.includes("/event")) return "event";
    return "menu";
  }, [pathname]);

  const [tab, setTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [fulfilment, setFulfilment] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [placing, setPlacing] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);
  const [payment, setPayment] = useState<"online" | "cash">("online");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    note: "",
  });
  const [event, setEvent] = useState({
    type: "birthday",
    date: "",
    guests: 20,
    budget: 25000,
    decor: "Signature florals",
    note: "",
  });
  const [review, setReview] = useState(0);

  useEffect(() => {
    if (slug) return;
    setLoading(true);
    Promise.allSettled([getFeaturedRestaurants(), getRestaurantsByOffering()])
      .then((results) => {
        const found = results.flatMap((result) =>
          result.status === "fulfilled" ? result.value : [],
        );
        const unique = Array.from(
          new Map(found.map((item) => [item.id, item])).values(),
        );
        if (unique.length) setPlaces(unique.map(fromRestaurant));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let live = true;
    setLoading(true);
    setError("");
    const load = async () => {
      try {
        if (isTable) {
          const [restaurant, menu, categoryList, active] = await Promise.all([
            getPublicRestaurant(slug),
            getPublicMenu(slug),
            getPublicCategories(slug),
            getTableActiveBooking(tableId),
          ]);
          if (!live) return;
          setPlace({
            ...demoPlaces[0],
            id: restaurant.id,
            name: restaurant.name,
            slug: restaurant.slug,
          });
          setItems(
            menu
              .filter((item) => item.isAvailable)
              .map((item, index) => ({
                id: item.id,
                name: item.name,
                description:
                  item.description || "Prepared fresh by the kitchen.",
                price: Number(item.price),
                image: item.imageUrl || foodImages[index % foodImages.length],
                category:
                  item.categories?.name ||
                  categoryList.find((entry) => entry.id === item.categoryId)
                    ?.name ||
                  "Menu",
                veg: !/chicken|mutton|fish|prawn|egg/i.test(item.name),
                available: item.isAvailable,
              })),
          );
          setCategories(categoryList.map((entry) => entry.name));
          setLocked(
            Boolean(
              active.hasActiveBooking && active.booking?.id !== bookingId,
            ),
          );
        } else {
          const [restaurant, menu, categoryList] = await Promise.all([
            getRestaurantDetail(slug),
            getRestaurantMenu(slug),
            getMenuCategories(slug),
          ]);
          if (!live) return;
          setPlace(fromRestaurant(restaurant));
          setItems(
            menu
              .filter((item) => item.isAvailable)
              .map((item, index) => ({
                id: item.id,
                name: item.name,
                description:
                  item.description || "Prepared fresh by the kitchen.",
                price: Number(item.price),
                image: item.imageUrl || foodImages[index % foodImages.length],
                category: item.category || "Menu",
                veg: item.isVeg,
                available: item.isAvailable,
              })),
          );
          setCategories(categoryList);
        }
      } catch {
        if (!live) return;
        if (isTable) {
          setError(
            "This table menu is unavailable. Please ask the restaurant team to check the QR code.",
          );
        } else {
          const fallback = demoPlaces.find((item) => item.slug === slug) || {
            ...demoPlaces[0],
            slug,
          };
          setPlace(fallback);
          setItems(demoItems);
          setCategories(
            Array.from(new Set(demoItems.map((item) => item.category))),
          );
          setNotice(
            "Preview menu shown while the restaurant service reconnects.",
          );
        }
      } finally {
        if (live) setLoading(false);
      }
    };
    load();
    return () => {
      live = false;
    };
  }, [slug, tableId, bookingId, isTable]);

  useEffect(() => {
    if (!slug) return;
    const key = "ordering-cart:" + slug + ":" + tableId;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        window.setTimeout(() => setCart(JSON.parse(saved)), 0);
      } catch {
        localStorage.removeItem(key);
      }
    }
  }, [slug, tableId]);

  useEffect(() => {
    if (slug)
      localStorage.setItem(
        "ordering-cart:" + slug + ":" + tableId,
        JSON.stringify(cart),
      );
  }, [cart, slug, tableId]);

  useEffect(() => {
    if (!orderId) return;
    const timer = window.setInterval(async () => {
      try {
        if (isTable) {
          const order = await getPublicOrder(orderId);
          setOrderStatus(order.status);
        } else {
          const order = await getOrder(orderId);
          setOrderStatus(order.orderStatus);
        }
      } catch {
        // Retain the latest confirmed status until the next poll.
      }
    }, 8000);
    return () => window.clearInterval(timer);
  }, [orderId, isTable]);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (category === "All" || item.category === category) &&
          (!vegOnly || item.veg) &&
          (item.name + " " + item.description)
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [items, category, vegOnly, search],
  );
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee =
    isTable || fulfilment === "pickup" ? 0 : place?.delivery || 0;
  const tax = subtotal * 0.05;
  const total = Math.max(0, subtotal + deliveryFee + tax + tip - discount);
  const activeStep = statusIndex[orderStatus.toLowerCase()] ?? 0;
  const steps = isTable ? tableSteps : onlineSteps;

  const add = (item: Item) =>
    setCart((current) => {
      const found = current.find((line) => line.id === item.id);
      return found
        ? current.map((line) =>
            line.id === item.id
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...current, { ...item, quantity: 1 }];
    });
  const change = (id: string, amount: number) =>
    setCart((current) =>
      current
        .map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + amount } : line,
        )
        .filter((line) => line.quantity > 0),
    );

  const findPlaces = async () => {
    setLoading(true);
    try {
      const result = await searchRestaurants({ search, sortBy: "relevance" });
      setPlaces(
        result.length
          ? result.map(fromRestaurant)
          : demoPlaces.filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase()),
            ),
      );
    } catch {
      setPlaces(
        demoPlaces.filter((item) =>
          (item.name + item.cuisine.join(" "))
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const applyCode = async () => {
    if (!coupon.trim()) return;
    setError("");
    try {
      if (!isTable && place) {
        const result = await validateCoupon(coupon.trim(), place.id, subtotal);
        if (!result.valid) throw new Error(result.message);
        setDiscount(result.discount);
      } else if (coupon.trim().toUpperCase() === "WELCOME10") {
        setDiscount(Math.min(subtotal * 0.1, 150));
      } else {
        throw new Error("Try WELCOME10");
      }
      setNotice("Coupon applied to your order.");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Coupon is not valid.",
      );
    }
  };

  const placeOrder = async () => {
    if (!place || !cart.length) return;
    if (
      !isTable &&
      fulfilment === "delivery" &&
      (!address.street || !address.city)
    ) {
      setError("Add your delivery street and city before placing the order.");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      if (isTable) {
        const result = await createPublicOrder({
          restaurantSlug: slug,
          tableId,
          qrToken,
          bookingId,
          items: cart.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        });
        setOrderId(result.id);
        setOrderStatus(result.status);
      } else {
        const result = await createOrder({
          tenantId: place.id,
          items: cart.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
          deliveryAddress: {
            ...address,
            street: fulfilment === "pickup" ? place.address : address.street,
            city: address.city || "Pickup",
            state: address.state || "NA",
            zipCode: address.zipCode || "000000",
            latitude: place.latitude,
            longitude: place.longitude,
          },
          paymentMethod: payment,
          couponCode: coupon || undefined,
          specialInstructions: "Tip: " + tip,
        });
        setOrderId(result.id);
        setOrderStatus(result.orderStatus);
      }
      setCart([]);
      setTab("track");
      setNotice("Order placed. The live timeline is now active.");
    } catch {
      setError(
        "We could not place the order. Please check the details and try again.",
      );
    } finally {
      setPlacing(false);
    }
  };

  const waiter = async (
    type: "Need Water" | "Call Waiter" | "Need Bill" | "Clean Table",
  ) => {
    try {
      await createWaiterRequest({
        restaurantSlug: slug,
        tableId,
        type,
        qrToken,
      });
      setNotice(type + " request sent to the floor team.");
    } catch {
      setError("The request could not be sent. Please try once more.");
    }
  };

  const reserve = async () => {
    if (!place || !booking.name || !booking.date || !booking.time) {
      setError("Add your name, date and time to request a table.");
      return;
    }
    try {
      if (isTable) {
        await createPublicReservation({
          restaurantSlug: slug,
          tableId,
          customerName: booking.name,
          customerPhone: booking.phone,
          guestCount: booking.guests,
          reservationAt: booking.date + "T" + booking.time,
          notes: booking.note,
        });
      } else {
        await bookTable({
          tenantId: place.id,
          customerName: booking.name,
          customerPhone: booking.phone,
          guestCount: booking.guests,
          bookingDate: booking.date,
          bookingTime: booking.time,
          specialRequests: booking.note,
        });
      }
      setNotice(
        "Table request received. Confirmation will arrive on your phone.",
      );
    } catch {
      setError("The table request could not be completed.");
    }
  };

  const reserveEvent = async () => {
    if (!place || !event.date) {
      setError("Choose an event date first.");
      return;
    }
    try {
      await bookEvent({
        tenantId: place.id,
        eventType: event.type as EventBooking["eventType"],
        eventDate: event.date,
        guestCount: event.guests,
        budget: event.budget,
        specialRequests: event.decor + ". " + event.note,
      });
      setNotice(
        "Event enquiry sent. The restaurant team will contact you with a plan.",
      );
    } catch {
      setError("The event enquiry could not be sent.");
    }
  };

  if (!slug) {
    return (
      <main className="min-h-screen bg-[#f6fbf9] text-[#10231f]">
        <section className="relative overflow-hidden border-b border-[#dbe9e4] bg-white px-4 py-10 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0a6f5d]">
                <Sparkles className="h-4 w-4" /> One place for every appetite
              </p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                Good food, from nearby tables to your front door.
              </h1>
              <p className="mt-4 max-w-xl text-base text-[#58706a]">
                Discover restaurants, order delivery, reserve a table or plan a
                celebration without hopping between screens.
              </p>
              <div className="mt-7 flex max-w-2xl items-center gap-2 rounded-lg border border-[#cbded8] bg-white p-2 shadow-[0_18px_50px_rgba(16,35,31,.10)]">
                <Search className="ml-2 h-5 w-5 text-[#0a6f5d]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && findPlaces()}
                  placeholder="Search restaurant or cuisine"
                  className="min-w-0 flex-1 bg-transparent px-2 py-3 outline-none"
                />
                <button
                  onClick={findPlaces}
                  className="rounded-lg bg-[#10231f] px-5 py-3 font-bold text-white transition hover:bg-[#0a6f5d]"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="grid h-[330px] grid-cols-2 gap-3">
              <img
                src={foodImages[0]}
                alt="Featured dish"
                className="h-full w-full rounded-lg object-cover"
              />
              <div className="grid gap-3">
                <img
                  src={foodImages[1]}
                  alt="Fresh meal"
                  className="h-[158px] w-full rounded-lg object-cover"
                />
                <img
                  src={foodImages[2]}
                  alt="Restaurant meal"
                  className="h-[158px] w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold text-[#0a6f5d]">OPEN NEAR YOU</p>
              <h2 className="text-2xl font-black">Restaurants worth a look</h2>
            </div>
            <span className="text-sm text-[#58706a]">
              {places.length} places
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(loading ? demoPlaces : places).map((item) => (
              <a
                key={item.id}
                href={"/online-ordering?restaurant=" + item.slug}
                className="group overflow-hidden rounded-lg border border-[#dbe9e4] bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {item.offer > 0 && (
                    <span className="absolute left-3 top-3 rounded bg-[#00ffcc] px-2 py-1 text-xs font-black text-[#10231f]">
                      {item.offer}% OFF
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">{item.name}</h3>
                      <p className="mt-1 text-sm text-[#58706a]">
                        {item.cuisine.join(" / ")}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 rounded bg-[#0a6f5d] px-2 py-1 text-sm font-bold text-white">
                      <Star className="h-3 w-3 fill-current" />
                      {item.rating}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#e5efeb] pt-3 text-sm">
                    <span>{item.eta} min</span>
                    <span>
                      {item.delivery
                        ? money(item.delivery) + " delivery"
                        : "Free delivery"}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f6fbf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#b9d8cf] border-t-[#0a6f5d]" />
      </div>
    );
  if (locked)
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6fbf9] p-5">
        <div className="max-w-md rounded-lg border border-[#dbe9e4] bg-white p-8 text-center shadow-xl">
          <Clock3 className="mx-auto h-10 w-10 text-[#ff6b57]" />
          <h1 className="mt-4 text-2xl font-black">This table is reserved</h1>
          <p className="mt-2 text-[#58706a]">
            Ask the floor team to confirm your booking before ordering from this
            QR code.
          </p>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#f6fbf9] pb-16 text-[#10231f]">
      <header className="border-b border-[#dbe9e4] bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <a
            href="/online-ordering"
            className="flex items-center gap-2 font-black"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#00ffcc]">
              <UtensilsCrossed className="h-5 w-5" />
            </span>
            A3 Ordering
          </a>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="hidden text-[#58706a] sm:inline">
              {isTable ? "Dine-in table service" : "Online ordering"}
            </span>
            <span className="rounded bg-[#e9fff9] px-2 py-1 text-[#0a6f5d]">
              {isTable ? "Table " + tableId : fulfilment}
            </span>
          </div>
        </div>
      </header>

      <section className="border-b border-[#dbe9e4] bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-8 lg:grid-cols-[1fr_370px]">
          <div className="flex min-w-0 gap-5">
            <img
              src={place?.image || foodImages[0]}
              alt={place?.name || "Restaurant"}
              className="h-32 w-32 rounded-lg object-cover sm:h-40 sm:w-52"
            />
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-[#0a6f5d]">
                {isTable ? "QR menu unlocked" : "Open for orders"}
              </p>
              <h1 className="mt-1 truncate text-3xl font-black sm:text-4xl">
                {place?.name}
              </h1>
              <p className="mt-2 line-clamp-2 text-sm text-[#58706a]">
                {place?.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#ffc857] text-[#ffc857]" />
                  {place?.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock3 className="h-4 w-4" />
                  {isTable ? "Kitchen live" : place?.eta + " min"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-[#ff6b57]" />
                  {place?.address}
                </span>
              </div>
            </div>
          </div>
          <MapCard address={place?.address || ""} />
        </div>
      </section>

      {notice && (
        <Message tone="success" text={notice} onClose={() => setNotice("")} />
      )}
      {error && (
        <Message tone="error" text={error} onClose={() => setError("")} />
      )}

      {isTable && (
        <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-8">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {waiterActions.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => waiter(label)}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#cfe2dc] bg-white p-3 text-sm font-bold transition hover:border-[#00cda4] hover:bg-[#eafff9]"
              >
                <Icon className="h-4 w-4 text-[#0a6f5d]" />
                {label}
              </button>
            ))}
          </div>
        </section>
      )}

      <nav className="sticky top-0 z-20 mt-5 border-y border-[#dbe9e4] bg-white/90 px-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-7xl overflow-x-auto">
          {tabs.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={cx(
                "flex min-w-max items-center gap-2 border-b-2 px-5 py-4 text-sm font-bold transition",
                tab === value
                  ? "border-[#0a6f5d] text-[#0a6f5d]"
                  : "border-transparent text-[#58706a]",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {tab === "menu" && (
          <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
            <section>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[#cfe2dc] bg-white px-3">
                  <Search className="h-4 w-4 text-[#0a6f5d]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search this menu"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </label>
                <button
                  onClick={() => setVegOnly(!vegOnly)}
                  className={cx(
                    "rounded-lg border px-4 py-3 text-sm font-bold",
                    vegOnly
                      ? "border-[#0a6f5d] bg-[#eafff9] text-[#0a6f5d]"
                      : "border-[#cfe2dc] bg-white",
                  )}
                >
                  Veg only
                </button>
              </div>
              <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                {["All", ...categories].map((entry) => (
                  <button
                    key={entry}
                    onClick={() => setCategory(entry)}
                    className={cx(
                      "min-w-max rounded-lg px-4 py-2 text-sm font-bold",
                      category === entry
                        ? "bg-[#10231f] text-white"
                        : "border border-[#cfe2dc] bg-white",
                    )}
                  >
                    {entry}
                  </button>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className="grid grid-cols-[1fr_120px] overflow-hidden rounded-lg border border-[#dbe9e4] bg-white shadow-[0_8px_24px_rgba(16,35,31,.06)]"
                  >
                    <div className="p-4">
                      <span
                        className={cx(
                          "mb-2 inline-block h-3 w-3 rounded-sm border-2",
                          item.veg
                            ? "border-[#0a9b75] bg-[#0a9b75]"
                            : "border-[#c64a3a] bg-[#c64a3a]",
                        )}
                      />
                      <h3 className="font-black">{item.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-[#58706a]">
                        {item.description}
                      </p>
                      <p className="mt-3 font-black">{money(item.price)}</p>
                    </div>
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full min-h-40 w-full object-cover"
                      />
                      <button
                        onClick={() => add(item)}
                        className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-black text-[#0a6f5d] shadow-lg transition hover:bg-[#00ffcc]"
                      >
                        <Plus className="h-4 w-4" />
                        ADD
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <CartPanel
              cart={cart}
              change={change}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              discount={discount}
              tip={tip}
              setTip={setTip}
              coupon={coupon}
              setCoupon={setCoupon}
              applyCode={applyCode}
              isTable={isTable}
              fulfilment={fulfilment}
              setFulfilment={setFulfilment}
              address={address}
              setAddress={setAddress}
              payment={payment}
              setPayment={setPayment}
              placeOrder={placeOrder}
              placing={placing}
            />
          </div>
        )}

        {tab === "table" && (
          <FormPanel
            title="Reserve your table"
            subtitle="Choose the moment. The restaurant will confirm availability by phone."
            icon={<CalendarDays className="h-6 w-6" />}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                value={booking.name}
                onChange={(value) => setBooking({ ...booking, name: value })}
              />
              <Field
                label="Phone"
                value={booking.phone}
                onChange={(value) => setBooking({ ...booking, phone: value })}
              />
              <Field
                label="Date"
                type="date"
                value={booking.date}
                onChange={(value) => setBooking({ ...booking, date: value })}
              />
              <Field
                label="Time"
                type="time"
                value={booking.time}
                onChange={(value) => setBooking({ ...booking, time: value })}
              />
              <Field
                label="Guests"
                type="number"
                value={String(booking.guests)}
                onChange={(value) =>
                  setBooking({ ...booking, guests: Number(value) })
                }
              />
              <Field
                label="Special request"
                value={booking.note}
                onChange={(value) => setBooking({ ...booking, note: value })}
              />
            </div>
            <Primary onClick={reserve}>Request table</Primary>
          </FormPanel>
        )}

        {tab === "event" && (
          <FormPanel
            title="Plan a celebration"
            subtitle="Birthdays, anniversaries, corporate dinners and private gatherings."
            icon={<PartyPopper className="h-6 w-6" />}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Event"
                value={event.type}
                onChange={(value) => setEvent({ ...event, type: value })}
                options={[
                  "birthday",
                  "anniversary",
                  "wedding",
                  "corporate",
                  "other",
                ]}
              />
              <Field
                label="Date"
                type="date"
                value={event.date}
                onChange={(value) => setEvent({ ...event, date: value })}
              />
              <Field
                label="Guests"
                type="number"
                value={String(event.guests)}
                onChange={(value) =>
                  setEvent({ ...event, guests: Number(value) })
                }
              />
              <Field
                label="Budget"
                type="number"
                value={String(event.budget)}
                onChange={(value) =>
                  setEvent({ ...event, budget: Number(value) })
                }
              />
              <SelectField
                label="Decoration"
                value={event.decor}
                onChange={(value) => setEvent({ ...event, decor: value })}
                options={[
                  "Signature florals",
                  "Minimal candlelight",
                  "Kids theme",
                  "Corporate setup",
                ]}
              />
              <Field
                label="Tell us more"
                value={event.note}
                onChange={(value) => setEvent({ ...event, note: value })}
              />
            </div>
            <Primary onClick={reserveEvent}>Send event enquiry</Primary>
          </FormPanel>
        )}

        {tab === "track" && (
          <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-[#dbe9e4] bg-white p-5 sm:p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-[#0a6f5d]">
                    Live order
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    {orderId
                      ? "#" + orderId.slice(-8).toUpperCase()
                      : "No active order"}
                  </h2>
                </div>
                <span className="rounded bg-[#eafff9] px-3 py-2 text-sm font-bold text-[#0a6f5d]">
                  {orderId
                    ? steps[Math.min(activeStep, steps.length - 1)]
                    : "Waiting"}
                </span>
              </div>
              <div className="mt-8 space-y-0">
                {steps.map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={cx(
                          "grid h-8 w-8 place-items-center rounded-full border-2",
                          index <= activeStep && Boolean(orderId)
                            ? "border-[#0a6f5d] bg-[#00ffcc]"
                            : "border-[#cadbd6] bg-white",
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                      {index < steps.length - 1 && (
                        <span
                          className={cx(
                            "h-10 w-0.5",
                            index < activeStep && Boolean(orderId)
                              ? "bg-[#0a6f5d]"
                              : "bg-[#dbe9e4]",
                          )}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="font-bold">{step}</p>
                      {index === activeStep && orderId && (
                        <p className="text-sm text-[#58706a]">
                          We will update this automatically.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="space-y-4">
              <div className="relative h-52 overflow-hidden rounded-lg border border-[#cfe2dc] bg-[#dff7ef] p-5">
                <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(#77b8a8_1px,transparent_1px),linear-gradient(90deg,#77b8a8_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="relative">
                  <Truck className="h-8 w-8 text-[#ff6b57]" />
                  <p className="mt-16 text-sm font-black">
                    {isTable ? "Kitchen to your table" : "Live delivery route"}
                  </p>
                  <p className="text-xs text-[#58706a]">
                    {isTable
                      ? "Your server is notified when dishes are ready."
                      : "Partner location appears after pickup."}
                  </p>
                </div>
              </div>
              <a
                href={place?.phone ? "tel:" + place.phone : "#"}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#cfe2dc] bg-white p-3 font-bold"
              >
                <Phone className="h-4 w-4" />
                Contact restaurant
              </a>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#cfe2dc] bg-white p-3 font-bold">
                <MessageCircle className="h-4 w-4" />
                Chat with support
              </button>
              <div className="rounded-lg border border-[#dbe9e4] bg-white p-4">
                <p className="font-bold">Rate your experience</p>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setReview(star);
                        setNotice("Thanks for rating your experience.");
                      }}
                      aria-label={"Rate " + star}
                    >
                      <Star
                        className={cx(
                          "h-6 w-6",
                          star <= review
                            ? "fill-[#ffc857] text-[#ffc857]"
                            : "text-[#b8c9c4]",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}

function Message({
  tone,
  text,
  onClose,
}: {
  tone: "success" | "error";
  text: string;
  onClose: () => void;
}) {
  return (
    <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-8">
      <div
        className={cx(
          "flex items-center justify-between rounded-lg border p-3 text-sm font-semibold",
          tone === "success"
            ? "border-[#a7e5d6] bg-[#eafff9] text-[#075c4d]"
            : "border-[#ffc8bf] bg-[#fff1ef] text-[#943427]",
        )}
      >
        <span className="flex items-center gap-2">
          {tone === "success" && <CheckCircle2 className="h-4 w-4" />}
          {text}
        </span>
        <button onClick={onClose} aria-label="Dismiss">
          x
        </button>
      </div>
    </div>
  );
}

function MapCard({ address }: { address: string }) {
  return (
    <div className="relative min-h-32 overflow-hidden rounded-lg border border-[#cfe2dc] bg-[#dff7ef] p-4">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(#77b8a8_1px,transparent_1px),linear-gradient(90deg,#77b8a8_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative flex h-full flex-col justify-between">
        <MapPin className="h-7 w-7 text-[#ff6b57]" />
        <div>
          <p className="text-xs font-bold uppercase text-[#0a6f5d]">
            Restaurant location
          </p>
          <p className="mt-1 text-sm font-bold">{address}</p>
        </div>
      </div>
    </div>
  );
}

function CartPanel(props: {
  cart: CartLine[];
  change: (id: string, amount: number) => void;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  discount: number;
  tip: number;
  setTip: (value: number) => void;
  coupon: string;
  setCoupon: (value: string) => void;
  applyCode: () => void;
  isTable: boolean;
  fulfilment: "delivery" | "pickup";
  setFulfilment: (value: "delivery" | "pickup") => void;
  address: { street: string; city: string; state: string; zipCode: string };
  setAddress: (value: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }) => void;
  payment: "online" | "cash";
  setPayment: (value: "online" | "cash") => void;
  placeOrder: () => void;
  placing: boolean;
}) {
  return (
    <aside className="h-fit rounded-lg border border-[#dbe9e4] bg-white p-4 shadow-[0_14px_38px_rgba(16,35,31,.08)] xl:sticky xl:top-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Your order</h2>
        <span className="grid h-8 min-w-8 place-items-center rounded bg-[#00ffcc] px-2 text-sm font-black">
          {props.cart.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      </div>
      {!props.cart.length ? (
        <div className="py-10 text-center text-[#58706a]">
          <ShoppingBag className="mx-auto mb-3 h-9 w-9" />
          <p className="font-bold">Your cart is ready</p>
          <p className="text-sm">Add a dish to begin.</p>
        </div>
      ) : (
        <div className="mt-4 max-h-56 space-y-3 overflow-auto">
          {props.cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image}
                alt=""
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{item.name}</p>
                <p className="text-xs text-[#58706a]">
                  {money(item.price * item.quantity)}
                </p>
              </div>
              <div className="flex items-center rounded-lg border border-[#cfe2dc]">
                <button
                  onClick={() => props.change(item.id, -1)}
                  className="p-2"
                  aria-label="Remove one"
                >
                  {item.quantity === 1 ? (
                    <Trash2 className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                </button>
                <span className="w-6 text-center text-xs font-black">
                  {item.quantity}
                </span>
                <button
                  onClick={() => props.change(item.id, 1)}
                  className="p-2"
                  aria-label="Add one"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!props.isTable && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => props.setFulfilment("delivery")}
            className={cx(
              "rounded-lg border p-2 text-sm font-bold",
              props.fulfilment === "delivery"
                ? "border-[#0a6f5d] bg-[#eafff9]"
                : "border-[#cfe2dc]",
            )}
          >
            Delivery
          </button>
          <button
            onClick={() => props.setFulfilment("pickup")}
            className={cx(
              "rounded-lg border p-2 text-sm font-bold",
              props.fulfilment === "pickup"
                ? "border-[#0a6f5d] bg-[#eafff9]"
                : "border-[#cfe2dc]",
            )}
          >
            Pickup
          </button>
        </div>
      )}
      {!props.isTable && props.fulfilment === "delivery" && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            value={props.address.street}
            onChange={(event) =>
              props.setAddress({ ...props.address, street: event.target.value })
            }
            placeholder="Street address"
            className="col-span-2 rounded-lg border border-[#cfe2dc] px-3 py-2 text-sm outline-none"
          />
          <input
            value={props.address.city}
            onChange={(event) =>
              props.setAddress({ ...props.address, city: event.target.value })
            }
            placeholder="City"
            className="rounded-lg border border-[#cfe2dc] px-3 py-2 text-sm outline-none"
          />
          <input
            value={props.address.zipCode}
            onChange={(event) =>
              props.setAddress({
                ...props.address,
                zipCode: event.target.value,
              })
            }
            placeholder="PIN code"
            className="rounded-lg border border-[#cfe2dc] px-3 py-2 text-sm outline-none"
          />
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <input
          value={props.coupon}
          onChange={(event) => props.setCoupon(event.target.value)}
          placeholder="Coupon code"
          className="min-w-0 flex-1 rounded-lg border border-[#cfe2dc] px-3 py-2 text-sm uppercase outline-none"
        />
        <button
          onClick={props.applyCode}
          className="rounded-lg border border-[#0a6f5d] px-3 text-sm font-bold text-[#0a6f5d]"
        >
          Apply
        </button>
      </div>
      <div className="mt-3">
        <p className="mb-2 flex items-center gap-2 text-sm font-bold">
          <Gift className="h-4 w-4 text-[#ff6b57]" />
          Add a tip
        </p>
        <div className="flex gap-2">
          {[0, 30, 50, 100].map((value) => (
            <button
              key={value}
              onClick={() => props.setTip(value)}
              className={cx(
                "flex-1 rounded-lg border py-2 text-xs font-bold",
                props.tip === value
                  ? "border-[#0a6f5d] bg-[#eafff9]"
                  : "border-[#cfe2dc]",
              )}
            >
              {value ? money(value) : "None"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => props.setPayment("online")}
          className={cx(
            "flex items-center justify-center gap-1 rounded-lg border p-2 text-xs font-bold",
            props.payment === "online"
              ? "border-[#0a6f5d] bg-[#eafff9]"
              : "border-[#cfe2dc]",
          )}
        >
          <WalletCards className="h-4 w-4" />
          Pay online
        </button>
        <button
          onClick={() => props.setPayment("cash")}
          className={cx(
            "flex items-center justify-center gap-1 rounded-lg border p-2 text-xs font-bold",
            props.payment === "cash"
              ? "border-[#0a6f5d] bg-[#eafff9]"
              : "border-[#cfe2dc]",
          )}
        >
          <Coins className="h-4 w-4" />
          {props.isTable ? "Pay at table" : "Cash"}
        </button>
      </div>
      <div className="mt-4 space-y-2 border-t border-[#e5efeb] pt-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <b>{money(props.subtotal)}</b>
        </div>
        {props.deliveryFee > 0 && (
          <div className="flex justify-between">
            <span>Delivery</span>
            <b>{money(props.deliveryFee)}</b>
          </div>
        )}
        <div className="flex justify-between">
          <span>Taxes</span>
          <b>{money(props.tax)}</b>
        </div>
        {props.discount > 0 && (
          <div className="flex justify-between text-[#0a6f5d]">
            <span>Discount</span>
            <b>-{money(props.discount)}</b>
          </div>
        )}
        <div className="flex justify-between border-t border-[#e5efeb] pt-3 text-lg">
          <span className="font-black">Total</span>
          <b>{money(props.total)}</b>
        </div>
      </div>
      <button
        disabled={!props.cart.length || props.placing}
        onClick={props.placeOrder}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#10231f] px-4 py-3 font-black text-white transition hover:bg-[#0a6f5d] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {props.placing ? "Placing order..." : "Place order"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </aside>
  );
}

function FormPanel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-[#dbe9e4] bg-white p-5 shadow-[0_14px_38px_rgba(16,35,31,.07)] sm:p-8">
      <div className="mb-6 flex gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#00ffcc]">
          {icon}
        </span>
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="text-sm text-[#58706a]">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-[#cfe2dc] px-3 py-3 font-normal outline-none focus:border-[#0a6f5d]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-[#cfe2dc] bg-white px-3 py-3 font-normal outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Primary({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="mt-6 flex items-center gap-2 rounded-lg bg-[#10231f] px-5 py-3 font-black text-white hover:bg-[#0a6f5d]"
    >
      {children}
      <ChevronRight className="h-4 w-4" />
    </button>
  );
}

