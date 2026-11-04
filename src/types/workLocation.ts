export type WorkLocationRadius = number;

export type WorkLocation = {
  address: string;
  latitude?: number;
  longitude?: number;
  radius: WorkLocationRadius;
};
