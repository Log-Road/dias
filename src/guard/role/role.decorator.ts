import { Reflector } from "@nestjs/core";
import { ROLE } from "../../utils/type.util";

export const Role = Reflector.createDecorator<ROLE[]>();
