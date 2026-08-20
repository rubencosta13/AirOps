import { PlaneArrivedListener } from "./plane-arrived.listener";
import { UserCreatedListener } from "./user-created.listener";

const setupListeners = async () => {
  new PlaneArrivedListener().createSubscription(
    "flight.events",
    "notification.arrival.arrived",
    "arrival.arrived",
  );

  new UserCreatedListener().createSubscription(
    "auth.events",
    "notification.auth.created",
    "auth.created",
  );
};

export { setupListeners };
