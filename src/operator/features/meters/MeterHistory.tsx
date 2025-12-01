import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { UserDto} from "../../../core/models/dto/UserDto";
import SearchBar from "../../../shared/components/searcher/SearchBar";
import ReusableTable from "../../../shared/components/table/ReusableTable";
import { TableColumnDefinition } from "../../../core/models/types/TableTypes";
import { getData } from "../../../core/services/apiService";
import { toast } from "react-toastify";
import AddEditHistoryModal from "./AddEditHistoryModal";

const MeterHistory = () => {
    
    const [user, setUsers] = useState<UserDto[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [filteredData, setFilteredData] = useState<UserDto[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Obtener datos al cargar el componente
    useEffect(() => {
        fetchData();
    }, []);

    // Obtener datos de la api
    const fetchData = async () => {
        setLoading(true);
        try {
            const users = await getData<UserDto[]>("/operator/users");
            setUsers(users);
            console.log(users)
            setFilteredData(users);
        }catch (e) {
              console.error(e);
              toast.error(e instanceof Error? e.message : "Error al obtener la información");
              setError("Error al cargar la información principal");
        } finally {
              setLoading(false);
        }

    };
    // Manejar búsqueda
    const handleSearch = (query: string) => {
        const filtered = user.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase())
        )
        );
        setFilteredData(filtered);
    };      


    // Columnas para ReusableTable
    const columns: TableColumnDefinition<UserDto>[] = [
        { key: "idUser", label: "ID", sortable: true },
        { key: "firstName", label: "Nombre", sortable: false },
        { key: "lastName", label: "Apellido", sortable: false },
        { key: "dni", label: "DNI", sortable: false },
        {
        key: "residenceDto",
        label: "Calle",
        sortable: false,
        render: (row) => row.residenceDto?.street
        },
        {
        key: "actions",
        label: "Acciones",
        actions: (row: UserDto) => (
            <Button
            variant="warning"
            onClick={() => {
                setSelectedUser(row);
                setShowModal(true);
            }}
            >
            Ver historial
            </Button>
        ),
        },
    ];


  return (
    <div>
      <h1 className="text-center">Historial de cambio de medidor</h1>
      {loading ? (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <span className="mb-2 fw-bold">CARGANDO...</span>
          <Spinner animation="border" role="status"></Spinner>
        </div>
      ) : error ? (
        <div className="text-center py-5">{error}</div>
      ) : (
        <div>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 mb-1">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Tabla */}
          <ReusableTable<UserDto>
            data={filteredData}
            columns={columns}
            defaultSort="idUser"
          />
        </div>
      )}
        {selectedUser && showModal && (
            <AddEditHistoryModal
              show={showModal}
              onHide={() => setShowModal(false)}
              userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
              userId={selectedUser.idUser}
            />
          )}
    </div>

  )
}

export default MeterHistory;