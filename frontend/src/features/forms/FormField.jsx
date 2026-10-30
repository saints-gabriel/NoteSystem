import { useResource } from "../../context/ResourceContext.jsx";
import { Field } from "../../components/ui/index.js";

const toOption = (option) => (typeof option === "object" ? option : { value: option, label: option });

function Select({ field, value, options, onChange }) {
  return (
    <select
      autoFocus={field.autoFocus}
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value,
          options.find((option) => String(option.value) === event.target.value),
        )
      }
    >
      <option value="">{field.emptyLabel ?? field.placeholder ?? "Selecione"}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function StaticSelect({ field, ...props }) {
  const options = (typeof field.options === "function" ? field.options() : field.options).map(toOption);
  return <Select field={field} options={options} {...props} />;
}

function ResourceSelect({ field, ...props }) {
  const { value, label } = field.source;
  const { items } = useResource(field.source.resource);
  const options = items.map((item) => ({ value: item[value], label: item[label], item }));
  return <Select field={field} options={options} {...props} />;
}

/** Renderiza um campo descrito em `formConfigs.js`. `onChange` recebe um objeto de alterações. */
export function FormField({ field, values, onChange }) {
  const { name, type = "text" } = field;
  const value = values[name] ?? "";
  const set = (next) => onChange({ [name]: next });

  const select = (SelectComponent) => (
    <SelectComponent
      field={field}
      value={value}
      onChange={(next, option) => {
        const synced = Object.fromEntries(
          Object.entries(field.sync ?? {}).map(([target, attribute]) => [
            target,
            option?.item?.[attribute] ?? "",
          ]),
        );
        onChange({ [name]: next, ...synced });
      }}
    />
  );

  let control;
  if (type === "select") control = select(field.source ? ResourceSelect : StaticSelect);
  else if (type === "textarea") {
    control = (
      <textarea
        rows="4"
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => set(e.target.value)}
      />
    );
  } else {
    control = (
      <input
        autoFocus={field.autoFocus}
        type={type}
        value={value}
        min={field.min}
        max={field.max}
        step={field.step}
        placeholder={field.placeholder}
        onChange={(event) => set(event.target.value)}
      />
    );
  }

  return (
    <Field label={field.required ? `${field.label} *` : field.label} full={field.full}>
      {control}
    </Field>
  );
}
