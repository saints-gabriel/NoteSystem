import { initialsOf } from "../../utils/format.js";

export function Avatar({ student, size = "md" }) {
  const color = student.color || "yellow";
  return (
    <span className={`avatar avatar-${color} avatar-${size}`}>
      {student.initials || initialsOf(student.name)}
    </span>
  );
}
