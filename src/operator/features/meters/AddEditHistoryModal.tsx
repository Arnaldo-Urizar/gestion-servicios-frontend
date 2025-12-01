import { useEffect, useState } from "react";
import { Button, Modal, Table, Form } from "react-bootstrap";
import { MeterChangeHistoryDto } from "../../../core/models/MeterChangeHistory";
import { getData, addData, updateData , deleteData } from "../../../core/services/apiService";
import { toast } from "react-toastify";
import { MeterHistoryDto } from "../../../core/models/MeterChangeHistory";

interface AddEditHistoryModalProps {
  show: boolean;
  onHide: () => void;
  userName: string;
  userId: number;
}


const AddEditHistoryModal: React.FC<AddEditHistoryModalProps> = ({show,onHide,userName,userId,}) => {

   // Estados
   const [metersHistory, setMetersHistory] = useState<MeterChangeHistoryDto[]>([]);
   const [loading, setLoading] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [isCreating, setIsCreating] = useState(false);   

   // Datos para enviar
   const [tempData, setTempData] = useState<MeterHistoryDto>({
        idUser: userId,
        oldMeterNumber: "",
        newMeterNumber: "",
        changeDate: "",
        notes: "",
   });
            
   //Obtener historial al abrir modal
   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const resp = await getData<MeterChangeHistoryDto[]>( `/operator/meter-change-history/user/${userId}`);
            setMetersHistory(resp);
         } catch (e) {
            console.error(e);
            toast.error("No se pudo obtener el historial");
         } finally {
            setLoading(false);
         }
      };
        if (show) fetchData();
   }, [show, userId]);

   // Campo para completar historial
   const handleCreate = () => {
      setIsCreating(true);
      setEditingId(null);
      
      setTempData({
         idUser: userId,
         oldMeterNumber: "",
         newMeterNumber: "",
         changeDate: "",
         notes: "",
      });
   };

    // Crear historial
   const handleSaveNew = async () => {
      try {
         setLoading(true);
         const response = await addData(`/operator/create-meter-change-history`, tempData)
			console.log(response)
         toast.success("Registro creado");

         setMetersHistory((prev) => [
               ...prev,
               {
                  idChange: Date.now(), // temporal
                  ...tempData,
               },
         ]);

         setIsCreating(false);
      } catch (e) {
         console.error(e);
         toast.error("No se pudo crear el registro");
      }finally{
         setLoading(false);
      }
   };


   // Editar historial
   const handleEdit = (row: MeterChangeHistoryDto) => {
      setIsCreating(false);
      setEditingId(row.idChange);

      setTempData({
         idUser: row.idUser,
         oldMeterNumber: row.oldMeterNumber,
         newMeterNumber: row.newMeterNumber,
         changeDate: row.changeDate,
         notes: row.notes,
      });
   };

   const handleCancelEdit = () => {
      setEditingId(null);  
   };


   // Actualizar historial
   const handleUpdate = async (id: number) => {
      try {
         setLoading(true);
         await updateData(`/operator/update-meter-change-history?idChangeMeter`,id, tempData,);
         toast.success("Historial actualizado");

         setMetersHistory((prev) =>
            prev.map((m) => (m.idChange === id ? { ...m, ...tempData } : m))
         );

         setEditingId(null);
      } catch (e) {
         console.error(e);
         toast.error("Error al actualizar");
      }finally{
         setLoading(false);
      }
   };

    // Eliminar historial
   const handleDelete = async (id: number) => {
      try {
         setLoading(true);
         await deleteData(`/operator/meter-change-history/delete?idMeterChange`,id)
         toast.success("Registro eliminado");
         setMetersHistory((prev) => prev.filter((m) => m.idChange !== id));
      } catch (e) {
         console.error(e);
         toast.error("Error al eliminar");
      }finally{
         setLoading(false);
      }
   };

   // Maneja cambios en los inputs
   const updateField = (field: keyof MeterHistoryDto, value: string) => {
      setTempData({ ...tempData, [field]: value });
   };

   return (
      <>
         <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                  <Modal.Title>
                     Historial de medidor – {userName}
                  </Modal.Title>
            </Modal.Header>

            <Modal.Body>
               <Button className="mb-3" onClick={handleCreate}> + Agregar registro </Button>
                  {loading ? (
                     <p className="text-center">Espera un momento...</p>
                  ) : (
                     <div className="table-responsive">
                        <Table bordered hover>
                           <thead>
                              <tr className="text-center">
                                 <th>Fecha</th>
                                 <th>Anterior</th>
                                 <th>Nuevo</th>
                                 <th>Motivo</th>
                                 <th>Acciones</th>
                              </tr>
                           </thead>

                           <tbody>
                              {isCreating && (
                                 <tr>
                                    <td>
                                       <Form.Control
                                          type="datetime-local"
                                          value={tempData.changeDate}
                                          onChange={(e) =>
                                          updateField("changeDate", e.target.value)
                                          }
                                       />
                                    </td>
                                    <td>
                                          <Form.Control
                                             type="text"
                                             value={tempData.oldMeterNumber}
                                             onChange={(e) =>
                                                updateField("oldMeterNumber", e.target.value)
                                             }
                                          />
                                    </td>
                                    <td>
                                          <Form.Control
                                             type="text"
                                             value={tempData.newMeterNumber}
                                             onChange={(e) =>
                                                updateField("newMeterNumber", e.target.value)
                                             }
                                          />
                                    </td>
                                    <td>
                                          <Form.Control
                                             type="text"
                                             value={tempData.notes}
                                             onChange={(e) =>
                                                updateField("notes", e.target.value)
                                             }
                                          />
                                    </td>
                                    <td className="text-center">
                                          <Button variant="primary" size="sm" className={"mb-2"} onClick={handleSaveNew}>
                                             Guardar
                                          </Button>{" "}
                                          <Button
                                             variant="secondary"
                                             size="sm"
                                             onClick={() => setIsCreating(false)}
                                          >
                                             Cancelar
                                          </Button>
                                    </td>
                                 </tr>
                              )}

                              {metersHistory.map((row) => (
                                 <tr key={row.idChange} className="text-center align-middle" >
                                    {editingId === row.idChange ? (
                                       <>
                                          <td>
                                             <Form.Control
                                                   type="datetime-local"
                                                   value={tempData.changeDate}
                                                   onChange={(e) =>
                                                      updateField("changeDate", e.target.value)
                                                   }
                                             />
                                          </td>
                                          <td>
                                             <Form.Control
                                                   type="text"
                                                   value={tempData.oldMeterNumber}
                                                   onChange={(e) =>
                                                      updateField("oldMeterNumber", e.target.value)
                                                   }
                                             />
                                          </td>
                                          <td>
                                             <Form.Control
                                                   type="text"
                                                   value={tempData.newMeterNumber}
                                                   onChange={(e) =>
                                                      updateField("newMeterNumber", e.target.value)
                                                   }
                                             />
                                          </td>
                                          <td>
                                             <Form.Control
                                                   type="text"
                                                   value={tempData.notes}
                                                   onChange={(e) =>
                                                      updateField("notes", e.target.value)
                                                   }
                                             />
                                          </td>
                                          <td className="text-center">
                                             <Button
                                                   className={"mb-2"}
                                                   variant="success"
                                                   size="sm"
                                                   onClick={() => handleUpdate(row.idChange)}
                                             >
                                                   Guardar
                                             </Button>{" "}
                                             <Button
                                                   variant="secondary"
                                                   size="sm"
                                                   onClick={handleCancelEdit}
                                             >
                                                   Cancelar
                                             </Button>
                                          </td>
                                       </>
                                    ) : (
                                       <>
                                          <td>{row.changeDate}</td>
                                          <td>{row.oldMeterNumber}</td>
                                          <td>{row.newMeterNumber}</td>
                                          <td>{row.notes}</td>
                                          <td className="text-center">
                                             <Button
                                                   variant="warning"
                                                   size="sm"
                                                   onClick={() => handleEdit(row)}
                                                   className="mb-1"
                                             >
                                                   Editar   
                                             </Button>{" "}
                                                      <Button
                                                   variant="danger"
                                                   size="sm"
                                                   onClick={() => handleDelete(row.idChange)}
                                                   className="mb-1"
                                             >
                                                   Eliminar
                                             </Button>
                                          </td>
                                       </>
                                    )}
                                 </tr>
                              ))}
                           </tbody>
                        </Table>
                     </div>
                  )}
            </Modal.Body>

            <Modal.Footer>
               <Button variant="secondary" onClick={onHide}>Cerrar</Button>
            </Modal.Footer>
         </Modal>       
      </>
   );
}

export default AddEditHistoryModal