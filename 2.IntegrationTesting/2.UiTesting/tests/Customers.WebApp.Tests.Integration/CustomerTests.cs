using Customers.Api.Repositories;
using Customers.WebApp.Data;
using Customers.WebApp.Repositories;
using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace Customers.WebApp.Tests.Integration;

[Collection("Shared collection")]
public class CustomerTests : IAsyncLifetime
{
    private readonly TestingContext _context;
    private IPage _page = null!;
    private readonly ICustomerRepository _customerRepository;
    private readonly Func<Task> _databaseReset;

    public CustomerTests(TestingContext context)
    {
        _context = context;
        _customerRepository = new CustomerRepository(_context.Database);
        _databaseReset = _context.ResetDatabaseAsync;
    }

    [Fact]
    public async Task Create_ShouldCreateCustomer_WhenDataIsValid()
    {
        // Arrange
        await _page.GotoAsync($"{TestingContext.AppUrl}/add-customer");
        var customer = new CustomerDto
        {
            Email = "nick@dometrain.com",
            FullName = "Nick Chapsas",
            DateOfBirth = new DateTime(1993, 1, 1),
            GitHubUsername = "nickchapsas"
        };
        _context.GitHubApiServer.SetupUser("nickchapsas");

        // Act
        await _page.Locator("id=fullname").FillAsync(customer.FullName);
        await _page.Locator("id=email").FillAsync(customer.Email);
        await _page.Locator("id=github-username").FillAsync(customer.GitHubUsername);
        await _page.Locator("id=dob").FillAsync(customer.DateOfBirth.ToString("yyyy-MM-dd"));
        await _page.Locator("text=Submit").ClickAsync();

        // Assert
        var hrefAsText = await _page.Locator("text='here'").GetAttributeAsync("href");
        var customerId = Guid.Parse(hrefAsText!.Replace("/customer/", string.Empty));
        var customerInDb = await _customerRepository.GetAsync(customerId);

        customerInDb.Should().BeEquivalentTo(customer, opt => opt.Excluding(x => x.Id));
    }

    public async Task InitializeAsync()
    {
        _page = await _context.Browser.NewPageAsync();
    }

    public async Task DisposeAsync()
    {
        await _page.CloseAsync();
        await _databaseReset();
    }
}
