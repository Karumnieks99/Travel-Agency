import React from "react";
import { Link } from "react-router-dom";

const EXTERNAL_HREF_PATTERN = /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i;

export default function AppLink({ href, to, ...props }) {
  const destination = to ?? href;

  if (typeof destination === "string") {
    if (destination.startsWith("#") || EXTERNAL_HREF_PATTERN.test(destination)) {
      return <a href={destination} {...props} />;
    }

    return <Link to={destination} {...props} />;
  }

  return <Link to={destination} {...props} />;
}
