import CheckBox from "../../components/debates/CheckBox";

import { CATEGORIES } from "../../utils/common/constant";

export default function Debates() {
  return (
    <div>
      <h1>debates</h1>
      <CheckBox candidates={CATEGORIES} />
    </div>
  );
}
