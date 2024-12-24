import React, {useEffect, useState} from "react";
import { Form, Input, Button, Switch, InputNumber, TimePicker, Select } from "antd";
import axios from "axios";
import api from "../api";
const { Option } = Select;


const CreateShiftForm = ({ onFinish, isOpenEnded, setIsOpenEnded }) => {
    const [products, setProducts] = useState([]);
    const [volumes, setVolumes] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        // Fetch products on component mount
        const fetchProducts = async () => {
            try {
                const response = await api.get("/shift/products/");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleProductChange = async (productId) => {
        setSelectedProduct(productId);
        setVolumes([]); // Clear previous volumes

        // Fetch volumes for the selected product
        try {
            const response = await api.get(`/shift/products/${productId}/volumes`);
            setVolumes(response.data);
        } catch (error) {
            console.error("Error fetching product volumes:", error);
        }
    };
    return (
        <Form onFinish={onFinish} layout="vertical">
            <Form.Item label="Назва зміни" name="name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
                <Form.Item label="Продукт" name="product" rules={[{ required: true }]}>
                    <Select onChange={handleProductChange} placeholder="Выберите продукт">
                        {products.map((product) => (
                            <Option key={product.id} value={product.id}>
                                {product.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Объем" name="volume" rules={[{ required: true }]}>
                    <Select placeholder="Выберите объем" disabled={!selectedProduct}>
                        {volumes.map((volume) => (
                            <Option key={volume.id} value={volume.id}>
                                {volume.volume} л
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            <Form.Item label="Ціль" name="goal" rules={[{ required: true, type: "number" }]}>
                <InputNumber type="number" />
            </Form.Item>
            <Form.Item label="Без обмеження на час" name="open_ended" valuePropName="checked">
                <Switch onChange={(checked) => setIsOpenEnded(checked)} />
            </Form.Item>
            {!isOpenEnded && (
                <Form.Item label="Тривалість зміни" name="countdown_time" rules={[{ required: true, message: "Вкажіть тривалість зміни" }]}>
                    <TimePicker />
                </Form.Item>
            )}
            <Button type="primary" htmlType="submit">
                Start Shift
            </Button>
        </Form>
    );
};

export default CreateShiftForm;
