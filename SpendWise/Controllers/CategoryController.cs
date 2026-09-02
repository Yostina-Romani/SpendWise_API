using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SpendWise.Models;
using SpendWise.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase

    {
        private readonly dbcontext _dbcontext;
        public CategoryController(dbcontext dbcontext)
        {
            _dbcontext = dbcontext;

        }

        [HttpGet("getcategories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _dbcontext.category.ToListAsync();
            return Ok(categories);
        }





        [Authorize(Roles ="Admin")]
        [HttpPost("addCategory")]
        public async Task<IActionResult> addCategory( Categories model)
        {
          await  _dbcontext.category.AddAsync(model);
           await _dbcontext.SaveChangesAsync();
            return Ok(new
            {
                message = "category added successfully"
            });
            
        }

        [Authorize(Roles ="Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditCategory(int id,Categories model)
        {
            var categor =await _dbcontext.category.FirstOrDefaultAsync(c => c.categoryID ==id);
            if (categor == null)
            {
                return NotFound(new
                {
                    Message="sorry not found"
                });
            }
            categor.categoryNmae = model.categoryNmae;
            categor.CategoryDescription = model.CategoryDescription;

            await _dbcontext.SaveChangesAsync();
            return Ok(new
            {
                message = "update successfully"
            });


        }
    }
    
}
