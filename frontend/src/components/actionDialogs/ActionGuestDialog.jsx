import { AwardSingleGuestDialog } from "../../pages/Events/pieces/AwardSingleGuestDialog";
import { DeleteGuestDialog } from "../deleteDialogs/DeleteGuestDialog";

export function ActionGuestDialog({ userId }) {
  return (
    <>
      <AwardSingleGuestDialog userId={userId} />
      <DeleteGuestDialog userId={userId} />
    </>
  );
}
