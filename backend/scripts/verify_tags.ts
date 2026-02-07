import { AppDataSource } from "../src/config/data-source";
import { User, UserRole } from "../src/modules/users/users.entity";
import { Product } from "../src/modules/products/products.entity";
import { TagsService } from "../src/modules/products/tags.service";
import * as bcrypt from "bcrypt";

async function verifyTags() {
    console.log("🚀 Initializing Data Source...");
    await AppDataSource.initialize();
    
    try {
        console.log("✅ Data Source has been initialized!");

        // 1. Get or Create a Test User (Admin)
        let admin = await AppDataSource.getRepository(User).findOne({ where: { role: UserRole.ADMIN } });
        if (!admin) {
             console.log("⚠️ No Admin found, creating one...");
             admin = new User();
             admin.username = "admin_test_tags";
             admin.email = "admin_test_tags@example.com";
             admin.password_hash = await bcrypt.hash("password123", 10);
             admin.role = UserRole.ADMIN;
             admin = await AppDataSource.getRepository(User).save(admin);
             console.log(`✅ Created Admin User: ${admin.username} (ID: ${admin.id})`);
        } else {
             console.log(`ℹ️ Using existing Admin User: ${admin.username} (ID: ${admin.id})`);
        }

        // 2. Get or Create a Test Product
        let product = await AppDataSource.getRepository(Product).findOne({ order: { id: "DESC" } });
        if (!product) {
             console.log("⚠️ No Product found, creating one...");
             product = new Product();
             product.title = "Test Product for Tags";
             product.description = "This is a test product";
             product.price = 1000;
             product.quantity = 10;
             product.sell_quantity = 0;
             product.user = admin;
             product = await AppDataSource.getRepository(Product).save(product);
             console.log(`✅ Created Product: ${product.title} (ID: ${product.id})`);
        } else {
             console.log(`ℹ️ Using valid Product: ${product.title} (ID: ${product.id})`);
        }

        // 3. Create a Tag
        const tagName = `Test Tag ${Date.now()}`;
        const tagColor = "#FF0000";
        console.log(`🔄 Creating Tag: ${tagName}...`);
        const tag = await TagsService.createTag(tagName, tagColor, admin.id);
        console.log(`✅ Tag Created: ${tag.name} (ID: ${tag.id})`);

        // 4. Assign Tag to Product
        console.log(`🔄 Assigning Tag (ID: ${tag.id}) to Product (ID: ${product.id})...`);
        await TagsService.assignTagToProduct(product.id, tag.id);
        
        // Verify Assignment
        let updatedProduct = await AppDataSource.getRepository(Product).findOne({ 
            where: { id: product.id },
            relations: ["tags"]
        });
        
        const assigned = updatedProduct?.tags.some(t => t.id === tag.id);
        if (assigned) {
            console.log("✅ Tag successfully assigned to Product!");
        } else {
            console.error("❌ Failed to assign Tag to Product!");
        }

        // 5. Remove Tag from Product
        console.log(`🔄 Removing Tag (ID: ${tag.id}) from Product (ID: ${product.id})...`);
        await TagsService.removeTagFromProduct(product.id, tag.id);

        // Verify Removal
        updatedProduct = await AppDataSource.getRepository(Product).findOne({ 
            where: { id: product.id },
            relations: ["tags"]
        });

        const removed = !updatedProduct?.tags.some(t => t.id === tag.id);
        if (removed) {
            console.log("✅ Tag successfully removed from Product!");
        } else {
            console.error("❌ Failed to remove Tag from Product!");
        }

    } catch (error) {
        console.error("❌ Error during verification:", error);
    } finally {
        await AppDataSource.destroy();
        console.log("🏁 Data Source destroyed.");
    }
}

verifyTags();
