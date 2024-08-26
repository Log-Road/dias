export class GetClubResponseDto {
  "clubs": GetClubResponseDtoClubs[];
}

class GetClubResponseDtoClubs {
  "club_id": string;
  "club_name": string;
  "is_active": boolean;
}
