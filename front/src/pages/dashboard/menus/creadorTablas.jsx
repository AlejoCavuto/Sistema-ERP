import {
  Button,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import React from "react";
import FieldGenerate from "../../../components/FieldGenerate";
import { useForm } from "react-hook-form";

export default function CrearTablas() {
  const { handleSubmit, register, reset } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [campos, setCampos] = React.useState([{ key: 0 }]);
  const [tablas, setTablas] = React.useState([]);
  const [editarTablas, setEditarTablas] = React.useState(null);
  const [editarFormulario, setEditarFormulario] = React.useState({
    table_title: '',
    table_columns: [],
  });

  const handleEditarTabla = (index) => {
    setEditarTablas(index);
    setEditarFormulario(tablas[index]);
    onOpenChange(true);
  };

  const submitEditar = handleSubmit((data) => {
    const actualizarTablas = [...tablas];
    actualizarTablas[editarTablas] = dataStructure(data);
    setTablas(actualizarTablas);
    reset();
    setEditarTablas(null);
    onOpenChange(false);
  });

  const agregarCampoEdicion = () => {
    setEditarFormulario({
      ...editarFormulario,
      table_columns: [...editarFormulario.table_columns, { name: '', dataType: '', length: '', AutoIncrement: false, PrimaryKey: false, NotNull: false }],
    });
  };

  const borrarCampoEdicion = (campoIndex) => {
    const actualizarCampos = editarFormulario.table_columns.filter((_, i) => i !== campoIndex);
    setEditarFormulario({ ...editarFormulario, table_columns: actualizarCampos });
  };

  const actualizarCampoEdicion = (campoIndex, nuevoCampoIndex) => {
    const actualizarCampos = [...editarFormulario.table_columns];
    actualizarCampos[campoIndex] = nuevoCampoIndex;
    setEditarFormulario({ ...editarFormulario, table_columns: actualizarCampos });
  };

  const handleAnidarCampos = (seleccionarTabla, seleccionarCampo) => {
    const CampoAnidado = { name: `${seleccionarTabla}.${seleccionarCampo.name}`, type: seleccionarCampo.type };
    setEditarFormulario({
      ...editarFormulario,
      table_columns: [...editarFormulario.table_columns, CampoAnidado],
    });
  };

  const handleClickerSubmit = () => {
    setCampos([...campos, { key: campos.length }]);
  };

  const dataStructure = (data) => {
    const datosEstructurados = {
      table_title: data.title,
      table_columns: campos.map((_, i) => {
        return {
          name: data[`${i + 1}name`] || '', // Nombre del campo
          dataType: data[`${i + 1}dataType`] || '', // Tipo de dato
          length: data[`${i + 1}length`] || '', // Longitud
          AutoIncrement: data[`${i + 1}AutoIncrement`] || false, // Auto Increment
          PrimaryKey: data[`${i + 1}PrimaryKey`] || false, // Primary Key
          NotNull: data[`${i + 1}NotNull`] || false, // Not Null
          anidado: data[`${i + 1}anidado`] || '', // Campo anidado, si existe
        };
      }).filter(col => col.name && col.dataType),
    };
    console.log('Campos generados:', campos);
console.log('Datos en dataStructure:', datosEstructurados);
    return datosEstructurados;
    
  };

  const handleDeleteField = (index) => {
    setCampos(campos.filter((_, i) => i !== index));
  };

  const submit = handleSubmit((data) => {
    const datos = dataStructure(data);
    console.log(datos);
    setTablas([...tablas, datos]);
    reset();
    onOpenChange(false);
  });

  return (
    <>
      <div className="p-5">
        <form onSubmit={submit}>
          <Input
            label="Título de Tabla"
            placeholder="Título..."
            name="title"
            {...register(`title`, { required: true })}
          />
          <div className="p-3">
            {campos.map((campo, i) => (
              <div key={i}>
                <FieldGenerate
                  register={register}
                  count={i}
                  tablas={tablas}
                  initialData={editarFormulario.table_columns[i]}
                  onChange={(actualizarCampoEdicion) => {
                    const actualizarCampos = [...editarFormulario.table_columns];
                    actualizarCampos[i] = actualizarCampoEdicion;
                    setEditarFormulario({ ...editarFormulario, table_columns: actualizarCampos });
                  }}
                />
                <Button
                  size="sm"
                  className="text-red-500"
                  variant="primary"
                  onClick={() => handleDeleteField(i)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button onPress={onOpen}>Crear Tabla</Button>
            <Button onClick={handleClickerSubmit}>Agregar Campo</Button>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="top-center"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      ¿Estás seguro de crear esta tabla?
                    </ModalHeader>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Volver
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        onClick={submit}
                      >
                        Crear
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </form>

        {/* Sección para mostrar las tablas creadas */}
        <div className="mt-5">
          <h2>Tablas Creadas</h2>
          {tablas.length === 0 ? (
            <p>No se han creado tablas todavía.</p>
          ) : (
            tablas.map((tabla, index) => (
              <div key={index} className="mb-4 p-3 border rounded">
                <h3>{tabla.table_title}</h3>
                <ul>
                  {tabla.table_columns.map((col, idx) => (
                    <li key={idx}>
                      {col.name} - {col.dataType}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => handleEditarTabla(index)}>Editar</Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Edición de Tabla */}
      <Modal  
        isOpen={editarTablas !== null}
        onOpenChange={() => setEditarTablas(null)}
        placement="top-center"
        size="xl"
      >
        <ModalContent>
          <form onSubmit={submitEditar}>
            <ModalHeader className="flex flex-col gap-1">
              Editar Tabla
            </ModalHeader>
            <Input
              label="Título de la tabla"
              placeholder="Título..."
              name="title"
              value={editarFormulario.table_title || ''}
              onChange={(e) => setEditarFormulario({ ...editarFormulario, table_title: e.target.value })}
              {...register('title', { required: true })}
            />
            <div className="p-3">
              {editarFormulario.table_columns && editarFormulario.table_columns.map((campo, i) => (
                <div key={i}>
                  <FieldGenerate
                    register={register}
                    count={i}
                    initialData={campo}
                    onChange={(data) => actualizarCampoEdicion(i, data)}
                    tablas={tablas} // Pasar tablas para el campo anidado
                  />
                  <Button
                    size="sm"
                    className="text-red-500"
                    variant="primary"
                    onClick={() => borrarCampoEdicion(i)}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
              <Button onClick={agregarCampoEdicion}>Agregar Campo</Button>
            </div>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={() => setEditarTablas(null)}>
                Cancelar
              </Button>
              <Button color='primary' type="submit">
                Guardar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
