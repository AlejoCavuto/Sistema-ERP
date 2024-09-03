import {
  Input,
  Autocomplete,
  Checkbox,
  AutocompleteItem,
} from "@nextui-org/react";
import { mysqlDataTypes } from "../helpers/dataTypes";

function FieldGenerate({ register, count, initialData, onChange, tablas }) {
  count += 1;

  // Manejo de cambios en campos de entrada
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...initialData, [name]: value });
  };

  // Manejo de cambios en el tipo de dato
  const handleAutocompleteChange = (value) => {
    onChange({ ...initialData, dataType: value });
  };

  // Manejo de cambios en campos anidados
  const handleAnidadoChange = (value) => {
    onChange({ ...initialData, anidado: value });
  };

  // Generar opciones para el Autocomplete de campos anidados
  const fieldOptions = tablas.flatMap(tabla =>
    tabla.table_columns.map(col => ({
      label: `${tabla.table_title}.${col.name}`,
      value: `${tabla.table_title}.${col.name}`,
    }))
  );

  return (
    <div className="flex gap-5">
      <div>
        <Input
          id={count}
          label="Nombre"
          placeholder="Nombre..."
          defaultValue={initialData?.name || ''}
          onChange={handleFieldChange} 
          {...register(`${count}name`)}
        />
      </div>
      <div>
        <Autocomplete
          id={count}
          defaultItems={mysqlDataTypes}
          label="Tipo de dato"
          placeholder="Integer"
          defaultValue={initialData?.dataType || ''}
          onChange={handleAutocompleteChange}
          {...register(`${count}dataType`)}
        >
          {(datatype) => (
            <AutocompleteItem key={datatype.value}>
              {datatype.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <div>
        <Input
          type="number"
          label="Cantidad"
          id={count}
          placeholder="Ingrese la longitud"
          defaultValue={initialData?.length || ''}
          onChange={handleFieldChange}
          {...register(`${count}length`)}
        />
      </div>

      <div className="flex gap-5 ml-4">
        <div className="flex flex-col items-center gap-2">
          <label className="h-fit">Auto Increment</label>
          <Checkbox
            className="h-fit"
            id={count}
            defaultChecked={initialData?.AutoIncrement || false}
            {...register(`${count}AutoIncrement`)}
            onChange={(e) => onChange({ ...initialData, AutoIncrement: e.target.checked })}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="h-fit">Primary Key</label>
          <Checkbox
            className="h-fit"
            id={count}
            defaultChecked={initialData?.PrimaryKey || false}
            {...register(`${count}PrimaryKey`)}
            onChange={(e) => onChange({ ...initialData, PrimaryKey: e.target.checked })}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="h-fit">Not Null</label>
          <Checkbox
            className="h-fit"
            id={count}
            defaultChecked={initialData?.NotNull || false}
            {...register(`${count}NotNull`)}
            onChange={(e) => onChange({ ...initialData, NotNull: e.target.checked })}
          />
        </div>
      </div>

      {/* Sección para seleccionar campos anidados */}
      <div>
        <Autocomplete
          id={count}
          defaultItems={fieldOptions}
          label="Campo Anidado"
          placeholder="Selecciona un campo..."
          defaultValue={initialData?.anidado || ''}
          onChange={handleAnidadoChange}
          {...register(`${count}anidado`)}
        >
          {(field) => (
            <AutocompleteItem key={field.value}>
              {field.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>
    </div>
  );
}

export default FieldGenerate;
