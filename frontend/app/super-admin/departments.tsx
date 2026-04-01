import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  createArea,
  createCategory,
  createDepartment,
  getAreas,
  getCategories,
  getDepartments,
  updateArea,
} from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { Picker } from "@react-native-picker/picker";
import {
  normalizeGeoBoundaryFromMapPoints,
  normalizePolygonFromGeoBoundary,
  type LatLngPoint,
} from "../../lib/geofence";
import OsmInteractiveMap from "../../components/OsmInteractiveMap";
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function DepartmentManagement() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  // Department form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Area form
  const [areaDepartmentId, setAreaDepartmentId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [areaPincode, setAreaPincode] = useState("");
  const [areaWard, setAreaWard] = useState("");

  // Category form
  const [categoryDepartmentId, setCategoryDepartmentId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryPriority, setCategoryPriority] = useState("MEDIUM");
  const [responseHours, setResponseHours] = useState("24");
  const [resolutionHours, setResolutionHours] = useState("72");

  const [departments, setDepartments] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [boundaryAreaId, setBoundaryAreaId] = useState("");
  const [drawingPoints, setDrawingPoints] = useState<LatLngPoint[]>([]);
  const [savingBoundary, setSavingBoundary] = useState(false);

  const normalizeArray = (res: any) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    return [];
  };

  const getId = (obj: any) => String(obj?._id || obj?.id || "");

  // Fetch departments on mount
  useEffect(() => {
    fetchAll();
  }, [token]);

  const fetchAll = async () => {
    await Promise.all([fetchDepartments(), fetchAreas(), fetchCategories()]);
  };

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments(token || undefined);
      setDepartments(normalizeArray(res));
    } catch (e) {
      setDepartments([]);
    }
  };

  const fetchAreas = async () => {
    try {
      const res = await getAreas(token || undefined);
      setAreas(normalizeArray(res));
    } catch (e) {
      setAreas([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories(token || undefined);
      setCategories(normalizeArray(res));
    } catch (e) {
      setCategories([]);
    }
  };

  // Helper to generate department code
  const generateCode = (deptName: string) => {
    return deptName
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "")
      .slice(0, 10);
  };

  const handleCreateDepartment = async () => {
    if (!name || !description || !contactEmail || !contactPhone) return;

    const code = generateCode(name);
    try {
      await createDepartment({
        name,
        code,
        description,
        contact_email: contactEmail,
        contact_phone: contactPhone,
      }, token || undefined);
      await fetchDepartments();
      Alert.alert("Success", "Department created");
    } catch (e) {
      Alert.alert("Error", "Failed to create department");
    }

    // Reset fields
    setName("");
    setDescription("");
    setContactEmail("");
    setContactPhone("");
  };

  const handleCreateArea = async () => {
    if (!areaDepartmentId || !areaName || !areaPincode) {
      Alert.alert("Missing fields", "Department, Area Name and Pincode are required");
      return;
    }

    try {
      await createArea(
        {
          department_id: areaDepartmentId,
          name: areaName,
          pincode: areaPincode,
          ward: areaWard || undefined,
        },
        token || undefined
      );

      await fetchAreas();
      Alert.alert("Success", "Area created");
      setAreaName("");
      setAreaPincode("");
      setAreaWard("");
    } catch (e) {
      Alert.alert("Error", "Failed to create area");
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryDepartmentId || !categoryName || !responseHours || !resolutionHours) {
      Alert.alert("Missing fields", "Please fill all category fields");
      return;
    }

    try {
      await createCategory(
        {
          department_id: categoryDepartmentId,
          name: categoryName,
          priority: categoryPriority,
          sla_response_hours: Number(responseHours),
          sla_resolution_hours: Number(resolutionHours),
        },
        token || undefined
      );

      await fetchCategories();
      Alert.alert("Success", "Category created");
      setCategoryName("");
      setCategoryPriority("MEDIUM");
      setResponseHours("24");
      setResolutionHours("72");
    } catch (e) {
      Alert.alert("Error", "Failed to create category");
    }
  };

  const selectedArea = areas.find((area) => getId(area) === boundaryAreaId);

  useEffect(() => {
    if (!boundaryAreaId) {
      setDrawingPoints([]);
      return;
    }

    const existingPoints = normalizePolygonFromGeoBoundary(selectedArea?.geo_boundary);
    setDrawingPoints(existingPoints);
  }, [boundaryAreaId, selectedArea?.geo_boundary]);

  const handleMapPress = (point: { latitude: number; longitude: number }) => {
    setDrawingPoints((prev) => [...prev, point]);
  };

  const clearBoundary = () => setDrawingPoints([]);

  const undoPoint = () => {
    setDrawingPoints((prev) => prev.slice(0, Math.max(prev.length - 1, 0)));
  };

  const saveBoundary = async () => {
    if (!boundaryAreaId) {
      Alert.alert("Missing area", "Please select an area first");
      return;
    }

    const geoBoundary = normalizeGeoBoundaryFromMapPoints(drawingPoints);
    if (!geoBoundary) {
      Alert.alert("Need at least 3 points", "Tap at least three points on the map to create a polygon");
      return;
    }

    try {
      setSavingBoundary(true);
      await updateArea(
        boundaryAreaId,
        { geo_boundary: geoBoundary },
        token || undefined
      );
      await fetchAreas();
      Alert.alert("Success", "Service area boundary saved");
    } catch (e) {
      Alert.alert("Error", "Failed to save boundary");
    } finally {
      setSavingBoundary(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Department Management
          </Text>
        </View>

        {/* Create Department */}
        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            Create Department
          </Text>

          <TextInput
            placeholder="Department Name"
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Department Description"
            value={description}
            onChangeText={setDescription}
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Contact Email"
            value={contactEmail}
            onChangeText={setContactEmail}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Contact Phone"
            value={contactPhone}
            onChangeText={setContactPhone}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#2563eb",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleCreateDepartment}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Add Department
            </Text>
          </TouchableOpacity>
        </View>

        {/* Department List */}
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Existing Departments
        </Text>

        {departments.map((dept) => (
          <View
            key={dept._id || dept.id || dept.code}
            style={{
              backgroundColor: "#f1f5f9",
              padding: 14,
              borderRadius: 10,
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>{dept.name}</Text>

            <View style={{ flexDirection: "row" }}>
              <Feather name="edit" size={18} style={{ marginRight: 12 }} />
              <Feather name="trash" size={18} color="red" />
            </View>
          </View>
        ))}

        {/* Create Area */}
        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 12,
            marginBottom: 20,
            marginTop: 16,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            Create Area
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Picker
              selectedValue={areaDepartmentId}
              onValueChange={(v: string) => setAreaDepartmentId(v)}
            >
              <Picker.Item label="Select Department" value="" />
              {departments.map((dept, index) => (
                <Picker.Item
                  key={dept._id || dept.id || `dept-area-${index}`}
                  label={String(dept?.name || "Unknown Department")}
                  value={dept._id || dept.id || `invalid-${index}`}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            placeholder="Area Name"
            value={areaName}
            onChangeText={setAreaName}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Pincode"
            value={areaPincode}
            onChangeText={setAreaPincode}
            keyboardType="number-pad"
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Ward (optional)"
            value={areaWard}
            onChangeText={setAreaWard}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#2563eb",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleCreateArea}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Add Area
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Existing Areas
        </Text>
        {areas.map((area, index) => (
          <View
            key={area._id || area.id || `area-${index}`}
            style={{
              backgroundColor: "#f1f5f9",
              padding: 14,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "600" }}>{String(area?.name || "Unnamed Area")}</Text>
            <Text style={{ color: "#64748b", marginTop: 2 }}>
              {String(area?.department_id?.name || "Unknown Dept")} | Pincode: {String(area?.pincode || "N/A")}
            </Text>
          </View>
        ))}

        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 12,
            marginBottom: 20,
            marginTop: 16,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            Draw Service Area Polygon
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Picker
              selectedValue={boundaryAreaId}
              onValueChange={(v: string) => setBoundaryAreaId(v)}
            >
              <Picker.Item label="Select Area" value="" />
              {areas.map((area, index) => (
                <Picker.Item
                  key={area._id || area.id || `boundary-area-${index}`}
                  label={String(area?.name || "Unnamed Area")}
                  value={String(area._id || area.id || "")}
                />
              ))}
            </Picker>
          </View>

          <View style={{ marginBottom: 10 }}>
            <OsmInteractiveMap
              mode="polygon"
              center={
                drawingPoints[0] || {
                  latitude: 23.0225,
                  longitude: 72.5714,
                }
              }
              polygon={drawingPoints}
              height={240}
              onAddPoint={handleMapPress}
            />
          </View>

          <Text style={{ color: "#64748b", marginBottom: 10 }}>
            Tap map to add polygon points. First point will be auto-closed when saving.
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#e2e8f0",
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
                flex: 1,
                marginRight: 8,
              }}
              onPress={undoPoint}
            >
              <Text style={{ fontWeight: "600" }}>Undo Point</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#e2e8f0",
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
                flex: 1,
                marginHorizontal: 4,
              }}
              onPress={clearBoundary}
            >
              <Text style={{ fontWeight: "600" }}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: savingBoundary ? "#60a5fa" : "#2563eb",
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
                flex: 1,
                marginLeft: 8,
              }}
              disabled={savingBoundary}
              onPress={saveBoundary}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                {savingBoundary ? "Saving..." : "Save Boundary"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Category */}
        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 12,
            marginBottom: 20,
            marginTop: 16,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            Create Category
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Picker
              selectedValue={categoryDepartmentId}
              onValueChange={(v: string) => setCategoryDepartmentId(v)}
            >
              <Picker.Item label="Select Department" value="" />
              {departments.map((dept, index) => (
                <Picker.Item
                  key={dept._id || dept.id || `dept-cat-${index}`}
                  label={String(dept?.name || "Unknown Department")}
                  value={dept._id || dept.id || `invalid-${index}`}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            placeholder="Category Name"
            value={categoryName}
            onChangeText={setCategoryName}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <View
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Picker
              selectedValue={categoryPriority}
              onValueChange={(v: string) => setCategoryPriority(v)}
            >
              <Picker.Item label="LOW" value="LOW" />
              <Picker.Item label="MEDIUM" value="MEDIUM" />
              <Picker.Item label="HIGH" value="HIGH" />
              <Picker.Item label="CRITICAL" value="CRITICAL" />
            </Picker>
          </View>

          <TextInput
            placeholder="SLA Response Hours"
            value={responseHours}
            onChangeText={(v) => setResponseHours(v.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="SLA Resolution Hours"
            value={resolutionHours}
            onChangeText={(v) => setResolutionHours(v.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#2563eb",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleCreateCategory}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Add Category
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Existing Categories
        </Text>
        {categories.map((category, index) => (
          <View
            key={category._id || category.id || `cat-${index}`}
            style={{
              backgroundColor: "#f1f5f9",
              padding: 14,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "600" }}>{String(category?.name || "Unnamed Category")}</Text>
            <Text style={{ color: "#64748b", marginTop: 2 }}>
              {String(category?.department_id?.name || "Unknown Dept")} | Priority: {String(category?.priority || "N/A")}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}