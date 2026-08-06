import { DepartureCreatedListener } from "./departure-created.listener"
import { PlaneArrivedListener } from "./plane-arrived.listener"

const setupListeners = async () => {
    new DepartureCreatedListener().createSubscription("notification.departure.created", "departure.created")
    new PlaneArrivedListener().createSubscription("notification.arrival.arrived", "arrival.arrived")

}

export { setupListeners }