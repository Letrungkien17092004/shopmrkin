import { PrismaClient } from '@prisma/client';
import ProductRepository from '../../repositories/ProductRepository.js'; // <-- Điều chỉnh lại path này
import { Product, User, Category } from '../../core/entities/index.js'; // <-- Điều chỉnh lại path này
import IProductRepository from '../../core/applications/interfaces/repositories/IProductRepository.js'; // <-- Điều chỉnh lại path này

// Khởi tạo Prisma client và Repository
const prisma = new PrismaClient();
let productRepository: IProductRepository;

// Biến lưu trữ data test
let testUser: User;
let testCategory: Category;

// =================================================================
// SETUP & TEARDOWN
// =================================================================

beforeAll(async () => {
    productRepository = new ProductRepository();

    // Khởi tạo data phụ thuộc (User, Category) để test
    // Đảm bảo data này là duy nhất để tránh xung đột
    const uniqueEmail = `test-user-${Date.now()}@example.com`;
    testUser = await prisma.users.create({
        data: {
            account: "uniqueEmail",
            username: 'Test User',
            email: uniqueEmail,
            roleId: 1,
            password_hash: 'password123', // Cần thiết nếu schema yêu cầu
            //... thêm các trường bắt buộc khác nếu có
        },
    });

    testCategory = await prisma.categories.create({
        data: {
            name: `Test Category ${Date.now()}`,
            slug: "test-category"
        },
    });
});

afterEach(async () => {
    // Dọn dẹp data sau mỗi test để đảm bảo tính độc lập
    // Xóa theo thứ tự phụ thuộc ngược (nếu có Variants, Media... thì xóa trước)
    await prisma.products.deleteMany();
});

afterAll(async () => {
    // Dọn dẹp data phụ thuộc sau khi chạy xong tất cả test
    await prisma.users.delete({ where: { id: testUser.id } });
    await prisma.categories.delete({ where: { id: testCategory.id } });

    // Ngắt kết nối Prisma
    await prisma.$disconnect();
});

// =================================================================
// TEST CASES
// =================================================================

describe('ProductRepository (Integration)', () => {

    /**
     * Test phương thức create()
     */
    describe('create', () => {
        it('should create a new product successfully', async () => {
            const productData = {
                name: 'Test Product',
                description: 'This is a test product.',
                categoryId: testCategory.id,
                userId: testUser.id,
            };

            const createdProduct = await productRepository.create({ data: productData });

            // 1. Kiểm tra kiểu trả về
            expect(createdProduct).toBeInstanceOf(Product);

            // 2. Kiểm tra các trường dữ liệu
            expect(createdProduct.id).toBeDefined();
            expect(createdProduct.product_code).toBeDefined();
            expect(createdProduct.name).toBe(productData.name);
            expect(createdProduct.userId).toBe(testUser.id);
            expect(createdProduct.categoryId).toBe(testCategory.id);

            // 3. (Optional) Kiểm tra trực tiếp trong DB
            const dbProduct = await prisma.products.findUnique({ where: { id: createdProduct.id } });
            expect(dbProduct).not.toBeNull();
            expect(dbProduct?.name).toBe(productData.name);
        });

        it('should create a new product and include relations', async () => {
            const productData = {
                name: 'Test Product Include',
                description: 'This is a test product.',
                categoryId: testCategory.id,
                userId: testUser.id,
            };

            const createdProduct = await productRepository.create({
                data: productData,
                include: { user: true, category: true }
            });

            // Kiểm tra các quan hệ được include
            expect(createdProduct.user).toBeDefined();
            expect(createdProduct.category).toBeDefined();
            expect(createdProduct.user?.id).toBe(testUser.id);
            expect(createdProduct.category?.id).toBe(testCategory.id);
            expect(createdProduct.user?.username).toBe(testUser.username);
        });
    });

    /**
     * Test các phương thức findOne...()
     */
    describe('findOneById / findOneByCode', () => {
        let newProduct: Product;

        beforeEach(async () => {
            // Tạo 1 product mẫu cho các test findOne
            newProduct = await productRepository.create({
                data: {
                    name: 'FindMe Product',
                    description: 'Product for finding tests.',
                    categoryId: testCategory.id,
                    userId: testUser.id,
                }
            });
        });

        it('should find a product by ID', async () => {
            const foundProduct = await productRepository.findOneById({
                where: { id: newProduct.id }
            });

            expect(foundProduct).not.toBeNull();
            expect(foundProduct).toBeInstanceOf(Product);
            expect(foundProduct?.id).toBe(newProduct.id);
            expect(foundProduct?.name).toBe(newProduct.name);
        });

        it('should find a product by product_code', async () => {
            const foundProduct = await productRepository.findOneByCode({
                where: { product_code: newProduct.product_code }
            });

            expect(foundProduct).not.toBeNull();
            expect(foundProduct).toBeInstanceOf(Product);
            expect(foundProduct?.product_code).toBe(newProduct.product_code);
        });

        it('should return null if ID does not exist', async () => {
            const foundProduct = await productRepository.findOneById({
                where: { id: 'non-existent-uuid-123' }
            });
            expect(foundProduct).toBeNull();
        });

        it('should find a product by ID and include relations', async () => {
            // (Giả sử bạn đã seed variant và media cho newProduct.id)
            // Tạm thời chỉ test include user và category
            const foundProduct = await productRepository.findOneById({
                where: { id: newProduct.id },
                include: { user: true, category: true, variants: true, media: true }
            });

            expect(foundProduct).not.toBeNull();
            expect(foundProduct?.user).toBeDefined();
            expect(foundProduct?.category).toBeDefined();
            expect(foundProduct?.user?.id).toBe(testUser.id);
            expect(foundProduct?.variants).toBeInstanceOf(Array); // Sẽ là [] nếu chưa seed
            expect(foundProduct?.media).toBeInstanceOf(Array); // Sẽ là [] nếu chưa seed
        });
    });

    /**
     * Test phương thức findMany()
     */
    describe('findMany', () => {
        beforeEach(async () => {
            // Tạo 3 products để test findMany
            await productRepository.create({
                data: { name: 'Product A', description: 'Desc A', categoryId: testCategory.id, userId: testUser.id }
            });
            await productRepository.create({
                data: { name: 'Product B', description: 'Desc B', categoryId: testCategory.id, userId: testUser.id }
            });
            await productRepository.create({
                data: { name: 'Product C', description: 'Desc C', categoryId: testCategory.id, userId: testUser.id }
            });
        });

        it('should find all products for a user', async () => {
            const products = await productRepository.findMany({
                where: { userId: testUser.id }
            });
            expect(products.length).toBe(3);
            expect(products[0]).toBeInstanceOf(Product);
        });

        it('should respect limit and offset', async () => {
            const products = await productRepository.findMany({
                where: { userId: testUser.id },
                limit: 1,
                offset: 1
            });
            expect(products.length).toBe(1);
        });

        it('should respect ordering', async () => {
            const products = await productRepository.findMany({
                where: { userId: testUser.id },
                orderBy: [{ name: 'desc' }],
                limit: 1
            });
            expect(products.length).toBe(1);
            expect(products[0].name).toBe('Product C');
        });

        it('should return empty array if no matches', async () => {
            const products = await productRepository.findMany({
                where: { userId: 'non-existent-user-id' }
            });
            expect(products.length).toBe(0);
        });
    });

    /**
     * Test phương thức updateById()
     */
    describe('updateById', () => {
        let productToUpdate: Product;

        beforeEach(async () => {
            productToUpdate = await productRepository.create({
                data: { name: 'Original Name', description: 'Original Desc', categoryId: testCategory.id, userId: testUser.id }
            });
        });

        it('should update a product successfully', async () => {
            const newName = 'Updated Product Name';
            const newDescription = 'Updated Description';

            await productRepository.updateById({
                where: { id: productToUpdate.id, userId: testUser.id },
                data: { name: newName, description: newDescription }
            });

            // Lấy lại product từ DB để kiểm tra
            const updatedProduct = await prisma.products.findUnique({ where: { id: productToUpdate.id } });

            expect(updatedProduct).not.toBeNull();
            expect(updatedProduct?.name).toBe(newName);
            expect(updatedProduct?.description).toBe(newDescription);
        });

        it('should throw an error if trying to update a non-existent product', async () => {
            // Prisma update ném lỗi P2025 (Record to update not found)
            // baseExceptionHandler của bạn sẽ bắt lỗi này
            await expect(
                productRepository.updateById({
                    where: { id: 'non-existent-uuid-123', userId: testUser.id },
                    data: { name: 'New Name' }
                })
            ).rejects.toThrow(); // Bạn có thể bắt lỗi cụ thể hơn nếu baseExceptionHandler của bạn ném lỗi custom
        });
    });

    /**
     * Test phương thức deleteById()
     */
    describe('deleteById', () => {
        let productToDelete: Product;

        beforeEach(async () => {
            productToDelete = await productRepository.create({
                data: { name: 'To Be Deleted', description: 'Delete me', categoryId: testCategory.id, userId: testUser.id }
            });
        });

        it('should delete a product successfully', async () => {
            // Đảm bảo product tồn tại
            let dbProduct = await prisma.products.findUnique({ where: { id: productToDelete.id } });
            expect(dbProduct).not.toBeNull();

            // Hành động xóa
            await productRepository.deleteById({
                where: { id: productToDelete.id, userId: testUser.id }
            });

            // Kiểm tra lại trong DB
            dbProduct = await prisma.products.findUnique({ where: { id: productToDelete.id } });
            expect(dbProduct).toBeNull();
        });

        it('should throw an error if trying to delete a non-existent product', async () => {
            // Prisma delete ném lỗi P2025 (Record to delete not found)
            await expect(
                productRepository.deleteById({
                    where: { id: 'non-existent-uuid-123', userId: testUser.id }
                })
            ).rejects.toThrow();
        });
    });
});